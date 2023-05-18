import os
import random
import pygame
import cv2
import numpy as np
import time
import math
import numpy as np
import mediapipe as mp
# from Button import ButtonImg
# import SceneManager
# from constants_and_resources import (
#     WRITE_VIDEO,
#     SCREEN_SIZE,
#     FPS,
#     GAMETIME,
#     SCRIPT_DIR,
#     MAXHANDS,
#     MUSIC_VOL, 
#     catBG, 
#     thanksBgImgPath,
#     backBtnPicturesImgPath,
#     clickSoundPath,
#     hoverSoundPath,
#     bubblesBgSoundPath,
#     bubblesImgDirPath,
#     popBubbleSoundPath,
#     fontPath
# )
# from utils_cls import HandDetector 
# for students
WRITE_VIDEO = False
MUSIC_VOL = 0.05
SCREEN_SIZE = (1280, 720)
FPS = 30
GAMETIME = 120
MAXHANDS = 1
catBG = catBG = "catBG_small.png"
thanksBgImgPath = "BackgroundThanks_small.png"
bubblesBgSoundPath = "backgroundMusic2.mp3"
bubblesImgDirPath = "bubbles"
popBubbleSoundPath = "pop_bubble.mp3"
fontPath = "21139.otf"

class HandDetector:
    def __init__(self, mode=False,maxHands=1, detectionCon=0.5, minTrackCon=0.5):
        self.mode = mode
        self.maxHands = maxHands
        self.detectionCon = detectionCon
        self.minTrackCon = minTrackCon

        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(static_image_mode=self.mode, 
                                        max_num_hands=self.maxHands,
                                        min_detection_confidence=self.detectionCon, 
                                        min_tracking_confidence = self.minTrackCon
        )
        self.mpDraw = mp.solutions.drawing_utils
        self.tipIds = [4, 8, 12, 16, 20]
        self.fingers = []
        self.lmList = []

    def findHands(self, img, draw=True, flipType=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)
        allHands = []
        h, w, c = img.shape
        if  self.results.multi_hand_landmarks:
            for handType,handLms in zip(self.results.multi_handedness,self.results.multi_hand_landmarks):
                myHand={}
                ## lmList
                mylmList = []
                xList = []
                yList = []
                for id, lm in enumerate(handLms.landmark):
                    px, py = int(lm.x * w), int(lm.y * h)
                    mylmList.append([px, py])
                    xList.append(px)
                    yList.append(py)

                ## bbox
                xmin, xmax = min(xList), max(xList)
                ymin, ymax = min(yList), max(yList)
                boxW, boxH = xmax - xmin, ymax - ymin
                bbox = xmin, ymin, boxW, boxH
                cx, cy = bbox[0] + (bbox[2] // 2), \
                         bbox[1] + (bbox[3] // 2)

                myHand["lmList"] = mylmList
                myHand["bbox"] = bbox
                myHand["center"] =  (cx, cy)

                if flipType:
                    if handType.classification[0].label =="Right":
                        myHand["type"] = "Left"
                    else:
                        myHand["type"] = "Right"
                else:myHand["type"] = handType.classification[0].label
                allHands.append(myHand)
               
        if draw:
            return allHands,img
        else:
            return allHands
    

    def findPosition(self, img, handNo=0, draw=True):
        xList = []
        yList = []
        bbox = []
        bboxInfo =[]
        self.lmList = []
        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNo]
            for id, lm in enumerate(myHand.landmark):
                h, w, c = img.shape
                px, py = int(lm.x * w), int(lm.y * h)
                xList.append(px)
                yList.append(py)
                self.lmList.append([px, py])
                
            xmin, xmax = min(xList), max(xList)
            ymin, ymax = min(yList), max(yList)
            boxW, boxH = xmax - xmin, ymax - ymin
            bbox = xmin, ymin, boxW, boxH
            cx, cy = bbox[0] + (bbox[2] // 2), \
                     bbox[1] + (bbox[3] // 2)
            bboxInfo = {"id": id, "bbox": bbox,"center": (cx, cy)}

        return self.lmList, bboxInfo

        
    def fingersUp(self,myHand):
        myHandType =myHand["type"]
        myLmList = myHand["lmList"]
        if self.results.multi_hand_landmarks:
            fingers = []
            # Thumb
            if myHandType == "Right":
                if myLmList[self.tipIds[0]][0] > myLmList[self.tipIds[0] - 1][0]:
                    fingers.append(1)
                else:
                    fingers.append(0)
            else:
                if myLmList[self.tipIds[0]][0] < myLmList[self.tipIds[0] - 1][0]:
                    fingers.append(1)
                else:
                    fingers.append(0)

            # 4 Fingers
            for id in range(1, 5):
                if myLmList[self.tipIds[id]][1] < myLmList[self.tipIds[id] - 2][1]:
                    fingers.append(1)
                else:
                    fingers.append(0)
        return fingers


    def findDistance(self,p1, p2, img=None):
        x1, y1 = p1
        x2, y2 = p2
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
        length = math.hypot(x2 - x1, y2 - y1)
        info = (x1, y1, x2, y2, cx, cy)
        if img is not None:
            return length,info, img
        else:
            return length, info
        
class Balloon:
    def __init__(self, pos, path, scale=1, grid=(2, 4),
                 animationFrames=None, speedAnimation=1, speed=0, pathSoundPop=None):
        # Loading Main Image
        img = pygame.image.load(path).convert_alpha()
        width, height = img.get_size()
        img = pygame.transform.smoothscale(img, (int(width * scale), int(height * scale)))
        width, height = img.get_size()

        # Split image to get all frames
        if animationFrames is None:  # When animation frames is not defined then use all frames
            animationFrames = grid[0] * grid[1]
        widthSingleFrame = width / grid[1]
        heightSingleFrame = height / grid[0]
        self.imgList = []
        counter = 0
        for row in range(grid[0]):
            for col in range(grid[1]):
                counter += 1
                if counter <= animationFrames:
                    imgCrop = img.subsurface((col * widthSingleFrame, 
                                              row * heightSingleFrame,
                                              widthSingleFrame, 
                                              heightSingleFrame
                                              )
                    )
                    self.imgList.append(imgCrop)

        self.img = self.imgList[0]
        self.rectImg = self.img.get_rect()
        self.rectImg.x, self.rectImg.y = pos[0], pos[1]
        self.pos = pos
        self.path = path
        self.animationCount = 0
        self.speedAnimation = speedAnimation
        self.isAnimating = False
        self.speed = speed
        self.pathSoundPop = pathSoundPop
        if self.pathSoundPop:
            self.soundPop = pygame.mixer.Sound(self.pathSoundPop)
        self.pop = False

    def draw(self, window):
        if self.isAnimating is False:
            self.rectImg.y -= self.speed
        window.blit(self.img, self.rectImg)

    def checkPop(self, x, y):
        # Check for the hit
        if self.rectImg.collidepoint(x, y) and self.isAnimating is False:
            self.isAnimating = True
            if self.pathSoundPop:
                self.soundPop.play()

        if self.isAnimating:
            # Loop through all the frames
            if self.animationCount != len(self.imgList) - 1:
                self.animationCount += 1
                self.img = self.imgList[self.animationCount]
            else:
                self.pop = True

        if self.pop:
            return self.rectImg.y
        else:
            return None


def render_time(font, timeRemaining, window):
    textTime = font.render(f"Время: {int(timeRemaining)}", True, (255, 255, 255))
    pygame.draw.rect(window, (93, 182, 249), (SCREEN_SIZE[0]-270, 10, 260, 70), border_radius=15)
    window.blit(textTime, (SCREEN_SIZE[0]-255, 13))         


def render_scores(font, score, window):
    textScore = font.render(f"Баллы: {score}", True, (255, 255, 255))
    pygame.draw.rect(window, (255, 102, 196), (10, 10, 320, 70), border_radius=15)
    window.blit(textScore, (25, 13))


def Game():
    # Initialize
    pygame.init()
    pygame.event.clear()

    # Create Window/Display
    window = pygame.display.set_mode(SCREEN_SIZE)
    pygame.display.set_caption("Bubbles Game")

    # Initialize Clock for FPS
    clock = pygame.time.Clock()

    # Webcam
    cap = cv2.VideoCapture(0)
    cap.set(3, SCREEN_SIZE[0])  # width
    cap.set(4, SCREEN_SIZE[1])  # height
    # cap.set(3, 1280)  # width
    # cap.set(4, 720)  # height
    cap.set(cv2.CAP_PROP_FPS, FPS) # FPS
    # if WRITE_VIDEO:
    #     out = cv2.VideoWriter(
    #         f'{SCRIPT_DIR}/videos/{strftime("%a-%d-%b-%Y-%H-%M-%S-bubbles", gmtime())}.avi',
    #         cv2.VideoWriter_fourcc('M','J','P','G'), 10, (SCREEN_SIZE[0],SCREEN_SIZE[1])
    #     )
    
    counter = 0
    prev_hands = False
    # used to record the time when we processed last frame
    prev_frame_time = 0
    # used to record the time at which we processed current frame
    new_frame_time = 0
    
    # Hand Detector
    detector = HandDetector(maxHands=MAXHANDS)

    # Variables
    balloons = []
    startTime = time.time()
    generatorStartTime = time.time()
    generatorDelay = 1
    speed = 1
    score = 0
    finger_coord_list = []
    
    # Images
    imgScore = pygame.image.load(thanksBgImgPath)

    # Buttons
    # buttonBack = ButtonImg((int(SCREEN_SIZE[0]/2), int(SCREEN_SIZE[1]*0.8)), backBtnPicturesImgPath,
    #                        pathSoundClick=clickSoundPath,
    #                        pathSoundHover=hoverSoundPath,
    #                        scale=0.5)

    # Load Music
    pygame.mixer.pre_init()
    pygame.mixer.music.load(bubblesBgSoundPath)
    pygame.mixer.music.set_volume(MUSIC_VOL)
    pygame.mixer.music.play()
    font = pygame.font.Font(fontPath, 50)

    # Get all Balloon paths
    pathListBalloons = os.listdir(bubblesImgDirPath)
    
    # Balloon Generator
    def generateBalloon():
        # Random X location for generation
        randomBallonPath = pathListBalloons[random.randint(0, len(pathListBalloons) - 1)]
        # x = random.randint(100, img.shape[1] - 100)
        # y = img.shape[0]
        x = random.randint(100, SCREEN_SIZE[0] - 100)
        y = SCREEN_SIZE[1]
        randomScale = round(random.uniform(0.3, 0.8), 2)
        balloons.append(Balloon((x, y),
                                path=os.path.join(bubblesImgDirPath, randomBallonPath),
                                grid=(2, 4), scale=randomScale, speed=speed, 
                                pathSoundPop=popBubbleSoundPath
                                )
        )
    imgBackground = pygame.image.load(catBG).convert()
    # Main loop
    start = True
    while start:
        # Get Events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                start = False
                pygame.quit()
                # break

            # if event.type == pygame.KEYDOWN:
            #     if event.key == pygame.K_a:
            #         start = False
            #         SceneManager.OpenScene("Menu")
        # Check if time is up
        timeRemaining = GAMETIME - (time.time() - startTime)

        if timeRemaining < 0 and start:
            window.blit(imgScore, (0, 0))
            # buttonBack.draw(window)
            
            # if buttonBack.state == "clicked":
            #     start = False
            #     pygame.mixer.music.stop()
            #     SceneManager.OpenScene("Menu")

        elif start:
            success, img = cap.read()
            img = cv2.flip(img, 1)
            # if WRITE_VIDEO:
            #     out.write(img)
            # counter += 1
            # if counter % 3 == 0:           
            #     
            # else:
            #     hands = prev_hands
            # prev_hands = hands 
            hands = detector.findHands(img, draw=False, flipType=False)
            # imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            # imgRGB = cv2.resize(imgRGB, SCREEN_SIZE)
            new_frame_time = time.time()
            fps = int(1/(new_frame_time-prev_frame_time))
            prev_frame_time = new_frame_time
           
            # cv2.putText(img, fps, (100,100), font, 4, (93, 207, 255), 3, cv2.LINE_AA)
                        
            # imgRGB = np.rot90(imgRGB)
            # frame = pygame.surfarray.make_surface(imgRGB).convert()
            # frame = pygame.transform.flip(frame, True, False)
            # window.blit(frame, (0, 0))
            window.blit(imgBackground, (0, 0))
            
            if hands:
                hand = hands[0]
                # x, y = hand["lmList"][8]
                finger_coord_list.append(hand["lmList"][8])
                    
                if len(finger_coord_list) > 4: 
                    finger_coord_list.pop(0)
                
                xfing = []
                yfing = []

                for i in finger_coord_list:
                    xfing.append(i[0])
                    yfing.append(i[1])
                     
                y = int(sum(yfing)/len(finger_coord_list)/720*SCREEN_SIZE[1])
                x = int(sum(xfing)/len(finger_coord_list)/1280*SCREEN_SIZE[0])
                pygame.draw.circle(window, (93, 182, 249), (x, y), 20)
                pygame.draw.circle(window, (255, 102, 196), (x, y), 16)
            else:
                x, y = 0, 0

            for i, balloon in enumerate(balloons):
                if balloon:
                    ballonScore = balloon.checkPop(x, y)
                    if ballonScore:
                        score += ballonScore // 10
                        balloons[i] = False
                    balloon.draw(window)

            if time.time() - generatorStartTime > generatorDelay:
                generatorDelay = random.uniform(0.8, 0.9)
                generateBalloon()
                generatorStartTime = time.time()
                speed += 0.2
            
            render_time(font, timeRemaining, window)
            render_scores(font, score, window)
        
        if start:
            # Update Display
            pygame.display.update()
            # Set FPS
            clock.tick(FPS)
    
    return start


if __name__ == "__main__":
    Game()
