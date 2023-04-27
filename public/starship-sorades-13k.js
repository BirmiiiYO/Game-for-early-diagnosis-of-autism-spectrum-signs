/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
function SfxrParams() {
	//--------------------------------------------------------------------------
	//
	//  Settings String Methods
	//
	//--------------------------------------------------------------------------
  
	/**
	 * Parses a settings string into the parameters
	 * @param string Settings string to parse
	 * @return If the string successfully parsed
	 */
	this.setSettingsString = function(string)
	{
	  var values = string.split(",");
	  this.waveType            = values[ 0] | 0;
	  this.attackTime          = values[ 1] * 1 || 0;
	  this.sustainTime         = values[ 2] * 1 || 0;
	  this.sustainPunch        = values[ 3] * 1 || 0;
	  this.decayTime           = values[ 4] * 1 || 0;
	  this.startFrequency      = values[ 5] * 1 || 0;
	  this.minFrequency        = values[ 6] * 1 || 0;
	  this.slide               = values[ 7] * 1 || 0;
	  this.deltaSlide          = values[ 8] * 1 || 0;
	  this.vibratoDepth        = values[ 9] * 1 || 0;
	  this.vibratoSpeed        = values[10] * 1 || 0;
	  this.changeAmount        = values[11] * 1 || 0;
	  this.changeSpeed         = values[12] * 1 || 0;
	  this.squareDuty          = values[13] * 1 || 0;
	  this.dutySweep           = values[14] * 1 || 0;
	  this.repeatSpeed         = values[15] * 1 || 0;
	  this.phaserOffset        = values[16] * 1 || 0;
	  this.phaserSweep         = values[17] * 1 || 0;
	  this.lpFilterCutoff      = values[18] * 1 || 0;
	  this.lpFilterCutoffSweep = values[19] * 1 || 0;
	  this.lpFilterResonance   = values[20] * 1 || 0;
	  this.hpFilterCutoff      = values[21] * 1 || 0;
	  this.hpFilterCutoffSweep = values[22] * 1 || 0;
	  this.masterVolume        = values[23] * 1 || 0;
  
	  // I moved this here from the reset(true) function
	  if (this.sustainTime < .01) {
		this.sustainTime = .01;
	  }
  
	  var totalTime = this.attackTime + this.sustainTime + this.decayTime;
	  if (totalTime < .18) {
		var multiplier = .18 / totalTime;
		this.attackTime  *= multiplier;
		this.sustainTime *= multiplier;
		this.decayTime   *= multiplier;
	  }
	}
  }
  
  /**
   * SfxrSynth
   *
   * Copyright 2010 Thomas Vian
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * @author Thomas Vian
   */
  function SfxrSynth() {
	// All variables are kept alive through function closures
  
	//--------------------------------------------------------------------------
	//
	//  Sound Parameters
	//
	//--------------------------------------------------------------------------
  
	this._params = new SfxrParams();  // Params instance
  
	//--------------------------------------------------------------------------
	//
	//  Synth Variables
	//
	//--------------------------------------------------------------------------
  
	var _envelopeLength0, // Length of the attack stage
		_envelopeLength1, // Length of the sustain stage
		_envelopeLength2, // Length of the decay stage
  
		_period,          // Period of the wave
		_maxPeriod,       // Maximum period before sound stops (from minFrequency)
  
		_slide,           // Note slide
		_deltaSlide,      // Change in slide
  
		_changeAmount,    // Amount to change the note by
		_changeTime,      // Counter for the note change
		_changeLimit,     // Once the time reaches this limit, the note changes
  
		_squareDuty,      // Offset of center switching point in the square wave
		_dutySweep;       // Amount to change the duty by
  
	//--------------------------------------------------------------------------
	//
	//  Synth Methods
	//
	//--------------------------------------------------------------------------
  
	/**
	 * Resets the runing variables from the params
	 * Used once at the start (total reset) and for the repeat effect (partial reset)
	 */
	this.reset = function() {
	  // Shorter reference
	  var p = this._params;
  
	  _period       = 100 / (p.startFrequency * p.startFrequency + .001);
	  _maxPeriod    = 100 / (p.minFrequency   * p.minFrequency   + .001);
  
	  _slide        = 1 - p.slide * p.slide * p.slide * .01;
	  _deltaSlide   = -p.deltaSlide * p.deltaSlide * p.deltaSlide * .000001;
  
	  if (!p.waveType) {
		_squareDuty = .5 - p.squareDuty / 2;
		_dutySweep  = -p.dutySweep * .00005;
	  }
  
	  _changeAmount = p.changeAmount > 0 ? 1 - p.changeAmount * p.changeAmount * .9 : 1 + p.changeAmount * p.changeAmount * 10;
	  _changeTime   = 0;
	  _changeLimit  = p.changeSpeed == 1 ? 0 : (1 - p.changeSpeed) * (1 - p.changeSpeed) * 20000 + 32;
	}
  
	// I split the reset() function into two functions for better readability
	this.totalReset = function() {
	  this.reset();
  
	  // Shorter reference
	  var p = this._params;
  
	  // Calculating the length is all that remained here, everything else moved somewhere
	  _envelopeLength0 = p.attackTime  * p.attackTime  * 100000;
	  _envelopeLength1 = p.sustainTime * p.sustainTime * 100000;
	  _envelopeLength2 = p.decayTime   * p.decayTime   * 100000 + 10;
	  // Full length of the volume envelop (and therefore sound)
	  return _envelopeLength0 + _envelopeLength1 + _envelopeLength2 | 0;
	}
  
	/**
	 * Writes the wave to the supplied buffer ByteArray
	 * @param buffer A ByteArray to write the wave to
	 * @return If the wave is finished
	 */
	this.synthWave = function(buffer, length) {
	  // Shorter reference
	  var p = this._params;
  
	  // If the filters are active
	  var _filters = p.lpFilterCutoff != 1 || p.hpFilterCutoff,
		  // Cutoff multiplier which adjusts the amount the wave position can move
		  _hpFilterCutoff = p.hpFilterCutoff * p.hpFilterCutoff * .1,
		  // Speed of the high-pass cutoff multiplier
		  _hpFilterDeltaCutoff = 1 + p.hpFilterCutoffSweep * .0003,
		  // Cutoff multiplier which adjusts the amount the wave position can move
		  _lpFilterCutoff = p.lpFilterCutoff * p.lpFilterCutoff * p.lpFilterCutoff * .1,
		  // Speed of the low-pass cutoff multiplier
		  _lpFilterDeltaCutoff = 1 + p.lpFilterCutoffSweep * .0001,
		  // If the low pass filter is active
		  _lpFilterOn = p.lpFilterCutoff != 1,
		  // masterVolume * masterVolume (for quick calculations)
		  _masterVolume = p.masterVolume * p.masterVolume,
		  // Minimum frequency before stopping
		  _minFreqency = p.minFrequency,
		  // If the phaser is active
		  _phaser = p.phaserOffset || p.phaserSweep,
		  // Change in phase offset
		  _phaserDeltaOffset = p.phaserSweep * p.phaserSweep * p.phaserSweep * .2,
		  // Phase offset for phaser effect
		  _phaserOffset = p.phaserOffset * p.phaserOffset * (p.phaserOffset < 0 ? -1020 : 1020),
		  // Once the time reaches this limit, some of the    iables are reset
		  _repeatLimit = p.repeatSpeed ? ((1 - p.repeatSpeed) * (1 - p.repeatSpeed) * 20000 | 0) + 32 : 0,
		  // The punch factor (louder at begining of sustain)
		  _sustainPunch = p.sustainPunch,
		  // Amount to change the period of the wave by at the peak of the vibrato wave
		  _vibratoAmplitude = p.vibratoDepth / 2,
		  // Speed at which the vibrato phase moves
		  _vibratoSpeed = p.vibratoSpeed * p.vibratoSpeed * .01,
		  // The type of wave to generate
		  _waveType = p.waveType;
  
	  var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
		  _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
		  _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
		  _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)
  
	  // Damping muliplier which restricts how fast the wave position can move
	  var _lpFilterDamping = 5 / (1 + p.lpFilterResonance * p.lpFilterResonance * 20) * (.01 + _lpFilterCutoff);
	  if (_lpFilterDamping > .8) {
		_lpFilterDamping = .8;
	  }
	  _lpFilterDamping = 1 - _lpFilterDamping;
  
	  var _finished = false,     // If the sound has finished
		  _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
		  _envelopeTime     = 0, // Current time through current enelope stage
		  _envelopeVolume   = 0, // Current volume of the envelope
		  _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
		  _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
		  _lpFilterOldPos,       // Previous low-pass wave position
		  _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
		  _periodTemp,           // Period modified by vibrato
		  _phase            = 0, // Phase through the wave
		  _phaserInt,            // Integer phaser offset, for bit maths
		  _phaserPos        = 0, // Position through the phaser buffer
		  _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
		  _repeatTime       = 0, // Counter for the repeats
		  _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
		  _superSample,          // Actual sample writen to the wave
		  _vibratoPhase     = 0; // Phase through the vibrato sine wave
  
	  // Buffer of wave values used to create the out of phase second wave
	  var _phaserBuffer = new Array(1024),
		  // Buffer of random values used to generate noise
		  _noiseBuffer  = new Array(32);
	  for (var i = _phaserBuffer.length; i--; ) {
		_phaserBuffer[i] = 0;
	  }
	  for (var i = _noiseBuffer.length; i--; ) {
		_noiseBuffer[i] = Math.random() * 2 - 1;
	  }
  
	  for (var i = 0; i < length; i++) {
		if (_finished) {
		  return i;
		}
  
		// Repeats every _repeatLimit times, partially resetting the sound parameters
		if (_repeatLimit) {
		  if (++_repeatTime >= _repeatLimit) {
			_repeatTime = 0;
			this.reset();
		  }
		}
  
		// If _changeLimit is reached, shifts the pitch
		if (_changeLimit) {
		  if (++_changeTime >= _changeLimit) {
			_changeLimit = 0;
			_period *= _changeAmount;
		  }
		}
  
		// Acccelerate and apply slide
		_slide += _deltaSlide;
		_period *= _slide;
  
		// Checks for frequency getting too low, and stops the sound if a minFrequency was set
		if (_period > _maxPeriod) {
		  _period = _maxPeriod;
		  if (_minFreqency > 0) {
			_finished = true;
		  }
		}
  
		_periodTemp = _period;
  
		// Applies the vibrato effect
		if (_vibratoAmplitude > 0) {
		  _vibratoPhase += _vibratoSpeed;
		  _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
		}
  
		_periodTemp |= 0;
		if (_periodTemp < 8) {
		  _periodTemp = 8;
		}
  
		// Sweeps the square duty
		if (!_waveType) {
		  _squareDuty += _dutySweep;
		  if (_squareDuty < 0) {
			_squareDuty = 0;
		  } else if (_squareDuty > .5) {
			_squareDuty = .5;
		  }
		}
  
		// Moves through the different stages of the volume envelope
		if (++_envelopeTime > _envelopeLength) {
		  _envelopeTime = 0;
  
		  switch (++_envelopeStage)  {
			case 1:
			  _envelopeLength = _envelopeLength1;
			  break;
			case 2:
			default:
			  _envelopeLength = _envelopeLength2;
		  }
		}
  
		// Sets the volume based on the position in the envelope
		switch (_envelopeStage) {
		  case 0:
			_envelopeVolume = _envelopeTime * _envelopeOverLength0;
			break;
		  case 1:
			_envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
			break;
		  case 2:
			_envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
			break;
		  case 3:
			default:
			_envelopeVolume = 0;
			_finished = true;
		}
  
		// Moves the phaser offset
		if (_phaser) {
		  _phaserOffset += _phaserDeltaOffset;
		  _phaserInt = _phaserOffset | 0;
		  if (_phaserInt < 0) {
			_phaserInt = -_phaserInt;
		  } else if (_phaserInt > 1023) {
			_phaserInt = 1023;
		  }
		}
  
		// Moves the high-pass filter cutoff
		if (_filters && _hpFilterDeltaCutoff) {
		  _hpFilterCutoff *= _hpFilterDeltaCutoff;
		  if (_hpFilterCutoff < .00001) {
			_hpFilterCutoff = .00001;
		  } else if (_hpFilterCutoff > .1) {
			_hpFilterCutoff = .1;
		  }
		}
  
		_superSample = 0;
		for (var j = 8; j--; ) {
		  // Cycles through the period
		  _phase++;
		  if (_phase >= _periodTemp) {
			_phase %= _periodTemp;
  
			// Generates new random noise for this period
			if (_waveType === 3) {
			  for (var n = _noiseBuffer.length; n--; ) {
				_noiseBuffer[n] = Math.random() * 2 - 1;
			  }
			}
		  }
  
		  // Gets the sample from the oscillator
		  switch (_waveType) {
			case 0: // Square wave
			  _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
			  break;
			case 1: // Saw wave
			  _sample = 1 - _phase / _periodTemp * 2;
			  break;
			case 2: // Sine wave (fast and accurate approx)
			  _pos = _phase / _periodTemp;
			  _pos = _pos > .5 ? (_pos - 1) * 6.28318531 : _pos * 6.28318531;
			  _sample = _pos < 0 ? 1.27323954 * _pos + .405284735 * _pos * _pos : 1.27323954 * _pos - .405284735 * _pos * _pos;
			  _sample = _sample < 0 ? .225 * (_sample *-_sample - _sample) + _sample : .225 * (_sample * _sample - _sample) + _sample;
			  break;
			case 3:
			default: // Noise
			  _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
		  }
  
		  // Applies the low and high pass filters
		  if (_filters) {
			_lpFilterOldPos = _lpFilterPos;
			_lpFilterCutoff *= _lpFilterDeltaCutoff;
			if (_lpFilterCutoff < 0) {
			  _lpFilterCutoff = 0;
			} else if (_lpFilterCutoff > .1) {
			  _lpFilterCutoff = .1;
			}
  
			if (_lpFilterOn) {
			  _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
			  _lpFilterDeltaPos *= _lpFilterDamping;
			} else {
			  _lpFilterPos = _sample;
			  _lpFilterDeltaPos = 0;
			}
  
			_lpFilterPos += _lpFilterDeltaPos;
  
			_hpFilterPos += _lpFilterPos - _lpFilterOldPos;
			_hpFilterPos *= 1 - _hpFilterCutoff;
			_sample = _hpFilterPos;
		  }
  
		  // Applies the phaser effect
		  if (_phaser) {
			_phaserBuffer[_phaserPos % 1024] = _sample;
			_sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
			_phaserPos++;
		  }
  
		  _superSample += _sample;
		}
  
		// Averages out the super samples and applies volumes
		_superSample *= .125 * _envelopeVolume * _masterVolume;
  
		// Clipping if too loud
		buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
	  }
  
	  return length;
	}
  }
  
  // Originally adapted from http://html5-demos.appspot.com/static/html5-whats-new/template/index.html#31
  // Now adapted from http://codebase.es/riffwave/
  var synth = new SfxrSynth();
  // Export for the Closure Compiler
  window['jsfxr'] = function(str) {
	// Initialize SfxrParams
	synth._params.setSettingsString(str);
	// Synthesize Wave
	var envelopeFullLength = synth.totalReset();
	var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
	var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
	var dv = new Uint32Array(data.buffer, 0, 44);
	// Initialize header
	dv[0] = 0x46464952; // "RIFF"
	dv[1] = used + 36;  // put total size here
	dv[2] = 0x45564157; // "WAVE"
	dv[3] = 0x20746D66; // "fmt "
	dv[4] = 0x00000010; // size of the following
	dv[5] = 0x00010001; // Mono: 1 channel, PCM format
	dv[6] = 0x0000AC44; // 44,100 samples per second
	dv[7] = 0x00015888; // byte rate: two bytes per sample
	dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
	dv[9] = 0x61746164; // "data"
	dv[10] = used;      // put number of samples here
  
	// Base64 encoding written by me, @maettig
	used += 44;
	var i = 0,
		base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
		output = 'data:audio/wav;base64,';
	for (; i < used; i += 3)
	{
	  var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
	  output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
	}
	i -= used;
	return output.slice(0, output.length - i) + '=='.slice(0, i);
  }

var interval;

var l = {
	// Currently a lot of objects and speeds don't scale well with the size of the canvas
	WIDTH: 500,
	HEIGHT: 500,
	// Scrolling speed for the background
	SPEED: 1,
	// Number of ticks for the screen flash effect
	MAX_BOMB: 3,
	y: 0,
	bomb: 0,
	text: {
		MAX_T: 3 * 30,
		t: 0
	},
	p: 0,
	points: {
		WIDTH: 32,
		HEIGHT: 48,
		STEP: 24,
		images: []
	}
};

var ship = {
	R: Math.max(l.WIDTH, l.HEIGHT) / 16 | 0,
	ACC: 1.5,
	ACC_FACTOR: .9,
	ANGLE_FACTOR: .8,
	MAX_ANGLE: 10,
	MAX_OSD: 6 * 30,
	x: l.WIDTH / 2,
	y: l.HEIGHT * 7 / 8 | 0,
	xAcc: 0,
	yAcc: 0,
	angle: 0,
	e: 100,
	timeout: 0,
	weapon: 0,
	reload: 0,
	shield: {
		MAX_T: 5 * 30,
		t: 0
	}
};

var bullets = [];
bullets.R = 8;
bullets.MAX_T = 35;

var explosions = [];

var bonus = [];
bonus.R = 16;
bonus.images = {};

var torpedos = [];
torpedos.R = 16;
torpedos.frame = 0;

var enemies = [];

function toggleFullscreen()
{
	if (document['fullscreenElement'] || document['mozFullScreen'] || document['webkitIsFullScreen'])
	{
		if (document['exitFullscreen'])
			document['exitFullscreen']();
		else if (document['mozCancelFullScreen'])
			document['mozCancelFullScreen']();
		else if (document['webkitCancelFullScreen'])
			document['webkitCancelFullScreen']();
	}
	else
	{
		var c = document.getElementsByTagName('canvas')[0];
		if (c['requestFullscreen'])
			c['requestFullscreen']();
		else if (c['mozRequestFullScreen'])
			c['mozRequestFullScreen']();
		else if (c['webkitRequestFullScreen'])
			c['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']);
	}
	return false;
}
// Export for the Closure Compiler
window['toggleFullscreen'] = toggleFullscreen;

// Helper function to hurt the player, or not if the shield is active
function hurt(e)
{
	if (ship.shield.t)
	{
		play(2);
		return;
	}
	// Merge multiple shots in a short time like they are a single shot
	if (ship.timeout < 0)
	{
		ship.e -= e;
		if (ship.e < 0)
			ship.e = 0;
		ship.timeout = 10;
	}
	if (!ship.e && !l.paused)
	{
		// Giant explosion
		explode(ship.x, ship.y, 512);
		explode(ship.x, ship.y, 1024);
		l.paused = true;
		spawnText("Конец игры", -1);
		// Stop the main game loop
		if (interval)
			window.clearInterval(interval);

		var text = 'Я выжил' + ((l.level || 1) - 1) + ' волн и заработал' + l.p + ' очков';
		// Always use my domain as canonical link
		var url = /^\w+:\/\/maettig\.com/.test(location.href)
			? location.href
			: 'http://maettig.com/code/canvas/starship-sorades-13k/';
		tweet.getElementsByTagName('A')[0].href = 'https://twitter.com/share?text=' +
			encodeURIComponent(text) + '&url=' + encodeURIComponent(url) + '&via=maettig';
		tweet.style.display = '';
		var input = tweet.getElementsByTagName('INPUT')[0];
		input.value = text + ' ' + url;
		input.onfocus = function() { this.select(); }
		input.focus();
		play(14); // Game over
	}
	else if (ship.e < 25)
		play(17); // Low energy
	play(1);
	// Remove some weapons if the player was hurt
	if (ship.weapon > 2)
		ship.weapon--;
	ship.osd = ship.MAX_OSD;
}

function fire(xAcc, yAcc)
{
	// The acceleration of the bullets changes with the acceleration of the ship
	xAcc += ship.xAcc / 2;
	yAcc += ship.yAcc / 2;
	bullets.push({
		t: bullets.MAX_T,
		x: ship.x + Math.random() * xAcc,
		y: ship.y + Math.random() * yAcc,
		xAcc: xAcc,
		yAcc: yAcc
	});
}

function explode(x, y, size)
{
	explosions.push({
		x: x,
		y: y,
		size: size ? size : Math.random() * 64,
		angle: Math.random(),
		d: Math.random() * .4 - .2,
		alpha: 1
	});
}

function spawnBonus(o, i)
{
	if (!i)
	{
		var r = Math.random();
		// A chance of 10 percent for every bonus, everything else is just money
		i = r > .9 ? '+' : (r > .8 ? 'E' : (r > .7 ? 'S' : (r > .6 ? 'B' : '10')));
	}
	// Lazy loading, this allows me to use every character I want whenever I want it
	if (!bonus.images[i])
		bonus.images[i] = render(function(c, a)
		{
			a.shadowBlur = 6;
			a.fillStyle = i.length > 1 ? '#FEB' : '#EFF';
			a.shadowColor = a.fillStyle;
			a.arc(c.width / 2, c.height / 2, c.width / 2 - a.shadowBlur, 0, Math.PI * 2);
			a.fill();
			a.fillStyle = 'rgba(0,0,0,.5)';
			a.font = 'bold ' + (c.width / 1.8 - i.length * 7 + 7 | 0) + 'px sans-serif';
			a.textAlign = 'center';
			a.textBaseline = 'middle';
			a.fillText(i, c.width / 2, c.height / 2);
		}, bonus.R * 2);
	bonus.push({
		i: i,
		x: o.x || l.WIDTH / 2,
		y: o.y || -bonus.R,
		xAcc: o.xAcc ? o.xAcc / 2 : Math.random() * l.SPEED - l.SPEED / 2,
		yAcc: (o.yAcc ? o.yAcc / 2 : 0) + l.SPEED / 2
	});
}

function spawnTorpedo(o, angle, maxAngle)
{
	var y = o.y + (o.yOffset || 0) | 0;
	// Never spawn any torpedos if the enemy is still to far away
	if (y < -l.HEIGHT / 4)
		return false
	if (maxAngle)
	{
		if (angle > Math.PI)
			angle -= Math.PI * 2;
		if (angle > maxAngle)
			angle = maxAngle;
		if (angle < -maxAngle)
			angle = -maxAngle;
	}
	// All torpedos share the same speed, no matter which enemy fires them
	var speed = 3 + l.level / 2;
	torpedos.push({
		x: o.x | 0,
		y: y,
		xAcc: angle ? Math.sin(angle) * speed : 0,
		yAcc: angle ? Math.cos(angle) * speed : speed,
		e: 0
	});
	return true;
}

// Little helper function to spawn a new enemy, calls the spawn method from the enemy object
function spawnEnemy(i, y)
{
	// Can be used to spawn a random enemy, currently unused
	if (i < 0 || i >= enemies.TYPES.length)
		i = Math.random() * enemies.TYPES.length | 0;
	var type = enemies.TYPES[i];
	if (!type.R)
		type.R = Math.max(l.WIDTH, l.HEIGHT) / 16 | 0;
	if (!type.image)
		type.image = render(type.render, type.R * 2);
	type.spawn(y);
}

function play(i)
{
	if (soundEffects[i] && soundEffects[i][soundEffects[i].i])
	{
		// Maybe I should have added a stop() call here, but I'm not sure about this
		soundEffects[i][soundEffects[i].i++].play(true);
		soundEffects[i].i %= soundEffects[i].length;
	}
}

// Helper function to render all the static buffered canvas image objects
function render(f, w, h, c)
{
	if (!c)
		c = document.createElement('canvas');
	c.width = w | 0;
	c.height = (h || w) | 0;
	f(c, c.getContext('2d'));
	return c;
}

// The players ship and all enemies do have a bright diamond shape in their center
function renderHeart(a, x, y)
{
	var p = ship.R / 6 | 0;
	a.beginPath();
	a.moveTo(x - p, y);
	a.lineTo(x, y + p);
	a.lineTo(x + p, y);
	a.lineTo(x, y - p);
	a.closePath();
	a.globalCompositeOperation = 'lighter';
	a.shadowColor = '#FFF';
	a.stroke();
}

// Helper function to spawn the title, "WAVE 1", "PAUSE" and "GAME OVER" text objects
function spawnText(text, t)
{
	// Always render the buffered image first
	l.text.image = render(function(c, a)
	{
		a.shadowBlur = c.height / 10 | 0;
		a.font = 'bold ' + (c.height * .9 - a.shadowBlur * 2 | 0) + 'px Consolas,monospace';
		a.textAlign = 'center';
		a.textBaseline = 'middle';

		var maxWidth = c.width - a.shadowBlur * 2;

		a.fillStyle = '#62F';
		a.shadowColor = '#FFF';
		for (var i = 2; i--; )
			a.fillText(text, c.width / 2, c.height / 2, maxWidth);

		a.fillStyle = '#FFF';
		a.shadowBlur /= 4;
		a.shadowColor = 'rgba(0,0,0,.5)';

		a.lineWidth = a.shadowBlur;
		a.lineJoin = 'round';
		a.strokeStyle = '#FFF';
		a.shadowColor = '#000';
		a.strokeText(text, c.width / 2, c.height / 2, maxWidth);

		a.globalAlpha = .2;
		a.globalCompositeOperation = 'source-atop';
		a.fillStyle = '#62F';
		// It seems I forgot to set shadowBlur = 0 here
		for (var i = 0; i < c.height; i += 3)
			a.fillRect(0, i, c.width, 1);
	}, l.WIDTH / 1.6, l.WIDTH / 8, l.text.image);
	l.text.x = (l.WIDTH - l.text.image.width) / 2 | 0;
	l.text.y = 16;
	l.text.yAcc = l.SPEED / 2;
	l.text.t = t || l.text.MAX_T;
	// The "PAUSE" and "GAME OVER" texts need to be drawn instantly
	if (t < 0)
	{
		l.text.t = 0;
		a.globalAlpha = 1;
		a.drawImage(l.text.image, l.text.x, l.text.y);
	}
}

// Render the ten numbers for the points in the upper right corner of the screen
for (var number = 10; number--; )
	l.points.images[number] = render(function(c, a)
	{
		a.shadowBlur = 6;
		a.font = 'bold ' + (c.width * 1.3 | 0) + 'px Consolas,monospace';
		a.textAlign = 'center';
		a.textBaseline = 'middle';
		a.lineWidth = 2;
		a.lineJoin = 'round';
		a.shadowColor = '#9F0';
		a.strokeText(number, c.width / 2, c.height / 2);
		a.strokeStyle = '#9F0';
		a.strokeText(number, c.width / 2, c.height / 2);
	}, l.points.WIDTH, l.points.HEIGHT);

// Render the level background
l.background = render(function(c, a)
{
	a.fillStyle = '#000';
	a.fillRect(0, 0, c.width, c.height);
	a.globalCompositeOperation = 'lighter';
	a.beginPath();
	for (var i = 6; i--; )
	{
		a.moveTo(c.width * (i + 1) / 4, -c.height);
		a.lineTo(c.width * (i - 2) / 4, c.height * 2);

		a.moveTo(-c.width, c.height * (i - 2) / 4);
		a.lineTo(c.width * 2, c.height * (i + 1) / 4);
	}
	a.lineWidth = 3;
	a.shadowBlur = a.lineWidth * 2;
	a.strokeStyle = '#111';
	a.shadowColor = '#444';
	a.stroke();
	// Mirror the image and render it on top of itself
	a.shadowBlur = 0;
	a.globalAlpha = .25;
	a.translate(c.width, 0);
	a.scale(-1, 1);
	a.drawImage(c, 0, 0);
}, 256);

// Render the graphic for the players ship
ship.image = render(function(c, a)
{
	a.beginPath();
	for (var i = 5; i--; )
	{
		a.moveTo(c.width / 2, c.height * (1 + i) / 10);
		a.lineTo(c.width * (11 + i) / 16, c.height * (15 - i) / 16);
		a.lineTo(c.width * ( 5 - i) / 16, c.height * (15 - i) / 16);
		a.closePath();
	}
	a.lineWidth = c.width / 17 | 0;
	a.shadowBlur = a.lineWidth * 2;
	a.strokeStyle = '#9F0';
	a.shadowColor = a.strokeStyle;
	a.stroke();
	a.stroke();

	// Maybe I could have used the renderHeart() function here but it's slightly different and I was to lazy
	var p = c.width / 6 | 0;
	a.beginPath();
	a.moveTo(c.width / 2 - p, c.height / 2);
	a.lineTo(c.width / 2, c.height / 2 + p);
	a.lineTo(c.width / 2 + p, c.height / 2);
	a.lineTo(c.width / 2, c.height / 2 - p);
	a.closePath();
	a.strokeStyle = '#FFF';
	a.shadowColor = a.strokeStyle;
	a.stroke();
	a.stroke();
}, ship.R, ship.R * 2);

// Render the shield graphic for the players ship
ship.shield.image = render(function(c, a)
{
	var d = 8;
	a.lineWidth = 18;
	a.shadowBlur = a.lineWidth;
	a.strokeStyle = '#000';
	a.shadowColor = '#CF0';
	a.beginPath();
	a.arc(c.width / 2, c.height / 2, c.width / 2 + a.lineWidth / 2 - d, 0, Math.PI * 2);
	a.stroke();
	// Draw a black arc to clip the outer half of the shadow
	a.lineWidth = 26 + d;
	a.shadowBlur = 0;
	a.beginPath();
	a.arc(c.width / 2, c.height / 2, c.width / 2 + a.lineWidth / 2 - d, 0, Math.PI * 2);
	a.stroke();
}, ship.R * 2);

// A bullet is a tiny diamond shape with a bright glowing shadow
bullets.image = render(function(c, a)
{
	a.beginPath();
	var p = 6;
	a.moveTo(c.width / 2, p);
	a.lineTo(c.width - p, c.height / 2);
	a.lineTo(c.width / 2, c.height - p);
	a.lineTo(p, c.height / 2);
	a.closePath();
	a.lineWidth = 3;
	a.shadowBlur = a.lineWidth * 2;
	a.strokeStyle = '#CF0';
	a.shadowColor = a.strokeStyle;
	a.stroke();
	a.stroke();
}, bullets.R * 2);

// The explosion sprite is only 16px but is painted in all sizes up to 1000px
explosions.image = render(function(c, a)
{
	a.fillStyle = '#F63'
	a.shadowBlur = 6;
	a.shadowColor = a.fillStyle;
	var p = a.shadowBlur;
	// Overlaying multiple blured rectangles make them almost disapear
	for (var i = 5; i--; )
		a.fillRect(p, p, c.width - p * 2, c.height - p * 2);
	// Draw a tiny, tiny cross in the middle
	a.lineWidth = .3;
	a.strokeStyle = '#FC6'
	p *= .8;
	a.beginPath();
	a.moveTo(p, p);
	a.lineTo(c.width - p, c.height - p);
	a.moveTo(c.width - p, p);
	a.lineTo(p, c.height - p);
	a.stroke();
}, 16);

// Buffer a sprite sheet instead of rotating the possible many, many torpedos on screen
torpedos.images = [];
var count = 8;
for (var i = count; i--; )
	torpedos.images.push(render(function(c, a)
	{
		a.translate(c.width / 2, c.height / 2);
		a.rotate(Math.PI / -2 * i / count);
		a.translate(-c.width / 2, -c.height / 2);
		a.beginPath();
		a.lineWidth = 3;
		a.shadowBlur = a.lineWidth * 2;
		a.strokeStyle = '#62F';
		a.shadowColor = a.strokeStyle;
		var p = a.shadowBlur;
		a.moveTo(c.width / 2, p);
		a.lineTo(c.width - p, c.height / 2);
		a.lineTo(c.width / 2, c.height - p);
		a.lineTo(p, c.height / 2);
		a.closePath();
		a.stroke();
		a.stroke();
	}, torpedos.R * 2));

// I wanted to use real inheritance but this is not so easy in JavaScript, unfortunately
enemies.TYPES = [
	// Enemy number 0 is the smallest
	{
		render: function(c, a)
		{
			a.lineWidth = 3;
			a.shadowBlur = a.lineWidth * 2;
			a.strokeStyle = '#62F';
			a.shadowColor = a.strokeStyle;
			a.miterLimit = 128;
			a.beginPath();
			for (var i = 5; i--; )
			{
				var x1 = c.width * (6 - i) / 11, y1 = c.height * (6 - i) / 20;
				var x2 = c.width * (11 - i) / 26, y2 = c.height * (1 + i) / 9;
				a.moveTo(c.width / 2, c.height * (12 - i) / 12 - a.shadowBlur);
				a.lineTo(c.width - x1, y1);
				a.lineTo(c.width - x2, y2);
				a.lineTo(x2, y2);
				a.lineTo(x1, y1);
				a.closePath();
			}
			a.stroke();
			a.stroke();
			renderHeart(a, c.width / 2, c.height / 2);
		},
		spawn: function(y)
		{
			for (var i = 2 + l.level; i--; )
			{
				var yStop = l.HEIGHT / 8 + Math.random() * l.HEIGHT / 4 | 0;
				enemies.push({
					image: this.image,
					x: this.R + (l.WIDTH - this.R * 2) * Math.random() | 0,
					y: y ? yStop + y : -this.R,
					yStop: yStop,
					r: this.R,
					angle: 0,
					maxAngle: Math.PI / 32,
					e: 12 + l.level,
					t: Math.random() * 120 | 0,
					shoot: this.shoot
				});
			}
		},
		shoot: function(angle)
		{
			//this.t = 120 - l.level * 10;
			this.t = 600 / (l.level + 4) | 0;
			if (this.t < 5)
				this.t = 5;
			if (spawnTorpedo(this, angle, this.maxAngle))
				play(19);
		}
	},
	// Enemy number 1 is slightly bigger than enemy number 0, but almost the same
	{
		render: function(c, a)
		{
			a.lineWidth = 3;
			a.shadowBlur = a.lineWidth * 2;
			a.strokeStyle = '#62F';
			a.shadowColor = a.strokeStyle;
			for (var i = 5; i--; )
			{
				var x1 = c.width * (5 - i) / 14 + a.shadowBlur, y1 = c.height * (16 - i) / 17;
				var x2 = c.width * (8 - i) / 22, y2 = c.height * (1 + i) / 11;
				a.moveTo(c.width / 2, c.height * (6 - i) / 12);
				a.lineTo(c.width - x1, y1);
				a.lineTo(c.width - x2, y2);
				a.lineTo(x2, y2);
				a.lineTo(x1, y1);
				a.closePath();
			}
			a.stroke();
			a.stroke();
			renderHeart(a, c.width / 2, c.height / 2);
		},
		spawn: function(y)
		{
			for (var i = 1 + l.level; i--; )
			{
				var yStop = l.HEIGHT / 8 + Math.random() * l.HEIGHT / 4 | 0;
				enemies.push({
					image: this.image,
					x: this.R + (l.WIDTH - this.R * 2) * Math.random() | 0,
					y: y ? yStop + y : -this.R,
					yStop: yStop,
					r: this.R,
					angle: 0,
					maxAngle: Math.PI / 16,
					e: 20 + l.level * 2,
					t: Math.random() * 120 | 0,
					shoot: this.shoot
				});
			}
		},
		shoot: function(angle)
		{
			//this.t = 120 - l.level * 10;
			this.t = 600 / (l.level + 4) | 0;
			if (this.t < 5)
				this.t = 5;
			// I can't use the angle calculation from the spawnTorpedo() function because of the two directions
			if (angle > Math.PI)
				angle -= Math.PI * 2;
			if (angle > this.maxAngle)
				angle = this.maxAngle;
			if (angle < -this.maxAngle)
				angle = -this.maxAngle;
			if (spawnTorpedo(this, angle + .1) ||
			    spawnTorpedo(this, angle - .1))
				play(20);
		}
	},
	// Enemy number 2 is probably the most dangerous, fires in all directions but does not aim
	{
		render: function(c, a)
		{
			a.lineWidth = 3;
			a.shadowBlur = a.lineWidth * 2;
			a.strokeStyle = '#62F';
			a.shadowColor = a.strokeStyle;
			a.miterLimit = 32;
			a.beginPath();
			for(var i = 0; i < Math.PI * 2; i += Math.PI / 4)
			{
				var d = Math.PI / 12;
				var r = c.width / 2 - a.shadowBlur;
				var x = c.width / 2 + Math.sin(i + d) * r, y = c.width / 2 + Math.cos(i + d) * r;
				if (!i)
					a.moveTo(x, y); else a.lineTo(x, y);
				d -= Math.PI / 1.45;
				a.lineTo(c.width / 2 + Math.sin(i + d) * r, c.width / 2 + Math.cos(i + d) * r);
			}
			a.closePath();
			for(var i = 0; i < Math.PI * 2; i += Math.PI / 4)
			{
				var r = c.width * .4;
				var x = c.width / 2 + Math.sin(i) * r, y = c.width / 2 + Math.cos(i) * r;
				if (!i)
					a.moveTo(x, y); else a.lineTo(x, y);
			}
			a.closePath();
			a.stroke();
			a.stroke();
			renderHeart(a, c.width / 2, c.height / 2);
		},
		spawn: function(y)
		{
			var yStep = l.HEIGHT * -1.5 / l.level | 0;
			for (var i = l.level; i--; )
			{
				enemies.push({
					image: this.image,
					x: l.WIDTH / 4 + l.WIDTH / 2 * Math.random() | 0,
					y: i * yStep + (y || -this.R),
					yStop: l.HEIGHT / 2 | 0,
					r: this.R,
					angle: 0,
					maxAngle: Math.PI * 32,
					e: 28 + l.level * 3,
					t: Math.random() * 30 | 0,
					fireDirection: Math.random() * Math.PI,
					shoot: this.shoot
				});
			}
		},
		shoot: function(angle)
		{
			// Insert a bigger pause between every 5 shots
			if (!this.tActive)
			{
				this.tActive = 5;
				// But the pause gets shorter every level
				//this.t = 60 - l.level * 4;
				this.t = 540 / (l.level + 8) | 0;
			}
			this.tActive--;
			if (this.t < 5)
				this.t = 5;
			this.fireDirection += .2;
			var result;
			for (var i = Math.PI / 8; i < Math.PI * 2; i += Math.PI)
				result = spawnTorpedo(this, this.fireDirection + i);
			if (result)
				play(18);
		}
	},
	// Enemy number 3 was the first I created, the idea was it grows bigger and bigger like in "Warning Forever"
	{
		R: Math.max(l.WIDTH, l.HEIGHT) / 8 | 0,
		render: function(c, a)
		{
			a.lineWidth = 3;
			a.shadowBlur = a.lineWidth * 2;
			a.strokeStyle = '#62F';
			a.shadowColor = a.strokeStyle;
			a.miterLimit = 32;
			a.beginPath();
			for (var i = 7; i--; )
			{
				a.moveTo(c.width / 2, c.height * i / 12 + a.shadowBlur);
				var x1 = c.width * (11 + i) / 18 - a.shadowBlur;
				var y1 = c.height * (25 - i) / 28;
				a.lineTo(x1, y1);
				var x2 = c.width * (16 - i) / 16 - a.shadowBlur;
				var y2 = c.height * (i + 4) / 28;
				a.lineTo(x2, y2);
				a.lineTo(c.width / 2, c.height * (i + 30) / 36 - a.shadowBlur);
				a.lineTo(c.width - x2, y2);
				a.lineTo(c.width - x1, y1);
				a.closePath();
			}
			a.stroke();
			a.stroke();
			renderHeart(a, c.width / 2, c.height * .8);
		},
		spawn: function(y)
		{
			var yStart = y || -this.R * 3;
			var e = 36 + l.level * 4;
			var tStart = 2 * 30;
			enemies.push({
				image: this.image,
				x: l.WIDTH / 2,
				y: yStart,
				yOffset: this.R * .6 | 0,
				yStop: this.R + 8,
				r: this.R,
				angle: 0,
				maxAngle: Math.PI / 8,
				e: e,
				t: tStart + Math.random() * 30 | 0,
				shoot: this.shoot
			});
			var size = this.R * 1.3;
			var d = size * .4;
			var x = d;
			for (var i = 1; i < l.level; i++)
			{
				var y = this.R + 16 - size + Math.sqrt(i) * 64;
				if (i % 2)
					y += this.R * (.7 / i + .3);
				enemies.push({
					image: this.image,
					x: l.WIDTH / 2 - x | 0,
					y: yStart,
					yOffset: size / 2 * .6 | 0,
					yStop: y | 0,
					r: size / 2,
					angle: 0,
					maxAngle: Math.PI / 8,
					e: e / 2 | 0,
					t: tStart + Math.random() * 30 | 0,
					shoot: this.shoot
				});
				enemies.push({
					image: this.image,
					x: l.WIDTH / 2 + x | 0,
					y: yStart,
					yOffset: size / 2 * .6 | 0,
					yStop: y | 0,
					r: size / 2,
					angle: 0,
					maxAngle: Math.PI / 8,
					e: e / 2 | 0,
					t: tStart + Math.random() * 30 | 0,
					shoot: this.shoot
				});
				x += d;
				d *= .84;
				size *= .9;
			}
		},
		shoot: function(angle)
		{
			// Always aim at the player and fire randomly, 1 shot every 3 seconds on average
			this.t = Math.random() * 6 * 30 | 0;
			if (spawnTorpedo(this, angle))
				play(12);
		}
	}
];

// This global variable will be needed again when the game ends
var tweet = document.getElementById('tweet');
if(tweet.style) {
	tweet.style.display = 'none';
}

// Initialization similar to the JS1K shim
var c = document.getElementsByTagName('canvas')[0];
c.width = l.WIDTH;
c.height = l.HEIGHT;
var a = c.getContext('2d');
a.fillStyle = '#000';
a.fillRect(0, 0, c.width, c.height);
spawnText('LOADING', -1);
spawnText('SORADES 13K', 6 * 30);

// Debug only
/*
var fps = Array(10);
fps.i = 0;
fps.t = 1;
*/

// Keyboard handling, cursor keys and X is my main control scheme but several others are provided
var keys = [], keyMap = {
	27: 80, // Esc => P
	32: 88, // Space => X
	48: 88, // 0 => X
	50: 40, // 2 => Down
	52: 37, // 4 => Left
	53: 40, // 5 => Down
	54: 39, // 6 => Right
	56: 38, // 8 => Up
	65: 37, // A => Left
	67: 88, // C => X
	68: 39, // D => Right
	73: 38, // I => Up
	74: 37, // J => Left
	75: 40, // K => Down
	76: 39, // L => Right
	83: 40, // S => Down
	87: 38, // W => Up
	89: 88, // Y => X
	90: 88  // Z => X
};

document.onkeydown = function(e)
{
	var c = e.keyCode;
	keys[keyMap[c] || c] = true;
	if (keys[70])
		toggleFullscreen();
	else if (keys[77])
	{
		if (ship.originalImage)
		{
			ship.image = ship.originalImage;
			ship.originalImage = null;
		}
		else
		{
			// That's all I need for my little easter egg, the code above is to be able to switch back
			var image = new Image();
			image.onload = function()
			{
				ship.originalImage = ship.image;
				ship.image = image;
			}
			image.src = 'starship-sorades.jpg';
		}
	}
	// Cheat key skips to the next level
	
	// else if (keys[79])
	// {
	// 	l.text.t = 0;
	// 	ship.weapon++;
	// 	ship.shield.t = ship.shield.MAX_T * 2;
	// 	enemies.length = 0;
	// }
	
	// Pause is not possible if the player is not alive
	else if (keys[80] && ship.e)
	{
		l.paused = !l.paused;
		// I'm abusing the messaging system but it's unable to handle multiple messages
		if (l.paused && !l.text.t)
			spawnText('Пауза', -1);
	}
	// Unpause with any of the fire keys
	else if (l.paused && keys[88])
		l.paused = false;
}

document.onkeyup = function(e)
{
	var c = (e || event).keyCode;
	// Remove the key code from the key pressed map
	keys[keyMap[c] || c] = false;
}

function gameloop()
{
	if (l.paused)
		return;

	if (--ship.reload <= 0)
	{
		// Weapon 0 and 1 fire in the same direction, but the later is a bit faster
		ship.reload = ship.weapon ? 4 : 6;
		fire(0, -16);
		if (ship.weapon > 1)
		{
			fire(-8, -8),
			fire(8, -8);
			if (ship.weapon > 2)
			{
				fire(0, 16);
				if (ship.weapon > 3)
					fire(-16, 0),
					fire(16, 0);
			}
		}
		play(ship.weapon > 2 ? 16 : ship.weapon > 0 ? 0 : 15);
	}
	ship.angle *= ship.ANGLE_FACTOR;
	if (keys[37])
	{
		// This is required for a fast turn when stuck at the edge of the screen
		if (ship.x >= l.WIDTH && ship.xAcc > 0)
			ship.xAcc = 0;
		ship.xAcc -= ship.ACC;
		ship.angle = (ship.angle + 1) * ship.ANGLE_FACTOR - 1;
	}
	if (keys[38])
	{
		if (ship.y >= l.HEIGHT && ship.yAcc > 0)
			ship.yAcc = 0;
		ship.yAcc -= ship.ACC;
	}
	if (keys[39])
	{
		if (ship.x < 0 && ship.xAcc < 0)
			ship.xAcc = 0;
		ship.xAcc += ship.ACC;
		ship.angle = (ship.angle - 1) * ship.ANGLE_FACTOR + 1;
	}
	if (keys[40])
	{
		if (ship.y < 0 && ship.yAcc < 0)
			ship.yAcc = 0;
		ship.yAcc += ship.ACC;
	}
	// Stop the players ship at all 4 edges of the screen
	if (ship.x < 0 && ship.xAcc < 0)
		ship.x = 0;
	else if (ship.x >= l.WIDTH && ship.xAcc > 0)
		ship.x = l.WIDTH - 1;
	if (ship.y < 0 && ship.yAcc < 0)
		ship.y = 0;
	else if (ship.y >= l.HEIGHT && ship.yAcc > 0)
		ship.y = l.HEIGHT - 1;
	// Accelerate the players ship
	ship.x += ship.xAcc;
	ship.y += ship.yAcc;
	// Decrease the acceleration. I don't need to clip to a maximum, this is enough.
	ship.xAcc *= ship.ACC_FACTOR;
	ship.yAcc *= ship.ACC_FACTOR;

	// Fill the screen with the background tile
	var size = l.background.width;
	for (var y = (l.y % size - size) | 0; y < l.HEIGHT; y += size)
		for (var x = 0; x < l.WIDTH; x += size)
			a.drawImage(l.background, x, y);
	l.y += l.SPEED;

	// Show the current points of the player in the top right corner of the screen
	var p = l.p, x = l.WIDTH - l.points.WIDTH - 8;
	while (p)
	{
		a.drawImage(l.points.images[p % 10], x, 4);
		p = p / 10 | 0;
		x -= l.points.STEP;
	}

	// Show the current text in the middle of the screen
	if (l.text.t)
	{
		a.globalAlpha = l.text.t < l.text.MAX_T ? l.text.t / l.text.MAX_T : 1;
		a.drawImage(l.text.image, l.text.x, l.text.y);
		a.globalAlpha = 1;
		l.text.t--;
		l.text.y += l.text.yAcc;
	}

	// Distance between a players shot and a torpedo
	var d = 12;
	for (var i = bullets.length; i--; )
	{
		// Avoid sub-pixel rendering by trimming all coordinates to whole numbers
		a.drawImage(bullets.image, bullets[i].x - bullets.R | 0, bullets[i].y - bullets.R | 0);
		bullets[i].x += bullets[i].xAcc;
		bullets[i].y += bullets[i].yAcc;
		for (var j = torpedos.length; j--; )
		{
			if (bullets[i].y < torpedos[j].y + d && bullets[i].y > torpedos[j].y - d &&
			    bullets[i].x < torpedos[j].x + d && bullets[i].x > torpedos[j].x - d)
			{
				if (--torpedos[j].e < 0)
				{
					l.p += 5;
					if (Math.random() > .75)
						spawnBonus(torpedos[j]);
					explode(torpedos[j].x, torpedos[j].y);
					torpedos[j].y = l.HEIGHT * 2;
					play(11);
				}
				//else
				//{
				//	l.p += 1;
				//	explode(bullets[i].x, bullets[i].y);
				//	play(9);
				//}
				bullets[i].t = 0;
				break;
			}
		}
		// There was a bug, the comparison "y < ship.R" was always false because ship.R is undefined
		if (--bullets[i].t < 0 || bullets[i].x < -bullets.R ||
			bullets[i].x >= l.WIDTH + bullets.R || bullets[i].y >= l.HEIGHT + bullets.R)
			bullets.splice(i, 1);
	}

	// The whole screen flashes
	if (l.bomb)
	{
		a.fillStyle = 'rgba(255,255,255,' + l.bomb-- / l.MAX_BOMB / 2 + ')';
		a.fillRect(0, 0, l.WIDTH, l.HEIGHT);
	}

	// Enable additive blending for everything below
	a.globalCompositeOperation = 'lighter';

	var d = ship.R * .8 | 0,
	    e = ship.R * .4 | 0;
	for (var i = bonus.length; i--; )
	{
		if (ship.y < bonus[i].y + d && ship.y > bonus[i].y - d &&
		    ship.x < bonus[i].x + e && ship.x > bonus[i].x - e)
		{
			l.p += 10;
			switch (bonus[i].i)
			{
				case '+':
					if (ship.weapon < 4)
					{
						ship.weapon++;
						play(5);
					}
					else play(6);
					break;
				case 'E':
					if (ship.e < 100)
					{
						ship.osd = ship.MAX_OSD;
						play(5);
					}
					else play(6);
					ship.e += 5;
					if (ship.e > 100)
						ship.e = 100;
					break;
				case 'S':
					// Multiple shields are not set but loaded, hence the addition
					ship.shield.t += ship.shield.MAX_T * ship.shield.MAX_T *
						2 / (ship.shield.t + ship.shield.MAX_T * 2) | 0;
					play(3);
					break;
				case 'B':
					for (var j = enemies.length; j--; )
					{
						enemies[j].e--;
						//explode(enemies[j].x, enemies[j].y);
					}
					// Avoid to much explosions at the same time, only for the oldest torpedos
					for (var j = Math.min(torpedos.length, 5); j--; )
						explode(torpedos[j].x, torpedos[j].y);
					// Delete all torpedos
					torpedos.length = 0;
					l.bomb = l.MAX_BOMB;
					play(13);
					break;
				default:
					play(7);
			}
			bonus[i].y = l.HEIGHT * 2;
		}
		// Avoid sub-pixel rendering by trimming all coordinates to whole numbers
		a.drawImage(bonus.images[bonus[i].i], bonus[i].x - bonus.R | 0, bonus[i].y - bonus.R | 0);
		bonus[i].x += bonus[i].xAcc;
		bonus[i].y += bonus[i].yAcc;
		if (bonus[i].y >= l.HEIGHT + bonus.R * 2 || bonus[i].x < -bonus.R ||
			bonus[i].x >= l.WIDTH + bonus.R || bonus[i].y < -bonus.R)
			bonus.splice(i, 1);
	}

	for (var j = torpedos.length; j--; )
	{
		if (ship.y < torpedos[j].y + d && ship.y > torpedos[j].y - d &&
		    ship.x < torpedos[j].x + e && ship.x > torpedos[j].x - e)
		{
			hurt(10);
			explode(torpedos[j].x, torpedos[j].y);
			torpedos[j].y = l.HEIGHT * 2;
		}

		// Avoid sub-pixel rendering by trimming all coordinates to whole numbers
		a.drawImage(torpedos.images[torpedos.frame],
			torpedos[j].x - torpedos.R | 0, torpedos[j].y - torpedos.R | 0);
		/*
		a.save()
		a.translate(torpedos[j].x, torpedos[j].y);
		a.rotate(torpedos.angle);
		a.drawImage(torpedos.image, -torpedos.R, -torpedos.R);
		a.restore();
		*/

		torpedos[j].x += torpedos[j].xAcc;
		torpedos[j].y += torpedos[j].yAcc;
		if (torpedos[j].y >= l.HEIGHT + torpedos.R || torpedos[j].x < -torpedos.R ||
			torpedos[j].x >= l.WIDTH + torpedos.R || torpedos[j].y < -l.HEIGHT)
			torpedos.splice(j, 1);
	}
	torpedos.frame++;
	torpedos.frame %= torpedos.images.length;
	ship.timeout--;

	for (var i = explosions.length; i--; )
	{
		a.save()
		a.globalAlpha = explosions[i].alpha;
		a.translate(explosions[i].x, explosions[i].y);
		a.rotate(explosions[i].angle);
		a.drawImage(explosions.image, -explosions[i].size / 2, -explosions[i].size / 2,
			explosions[i].size, explosions[i].size);
		a.restore();
		//a.lineWidth = .2;
		//a.strokeStyle = '#FFF';
		//a.strokeRect(explosions[i].x - explosions[i].size / 2, explosions[i].y - explosions[i].size / 2,
		//	explosions[i].size, explosions[i].size);
		explosions[i].size += 16;
		explosions[i].angle += explosions[i].d;
		explosions[i].alpha -= .1;
		// Never compare floating point numbers with integer numbers, always use an epsilon
		if (explosions[i].alpha < .1)
			explosions.splice(i, 1);
	}

	a.save()
	a.translate(ship.x, ship.y);
	var angle = ship.angle * ship.MAX_ANGLE;
	a.rotate(angle / 180 * Math.PI);
	a.drawImage(ship.image, -ship.R / 2 | 0, -ship.R);
	a.restore();

	if (ship.shield.t)
	{
		if (ship.shield.t > 30 || Math.random() > .5)
			a.drawImage(ship.shield.image, ship.x - ship.R + .5 | 0, ship.y - ship.R + .5 | 0);
		if (!--ship.shield.t)
			play(4);
	}

	// Test only: l.text.t=0;
	// Spawn new enemies if they are all destroyed and the text is gone
	if (!enemies.length && !l.text.t)
	{
		l.p += (l.level || 0) * 1000;
		l.level = (l.level || 0) + 1;
		//for (var i = enemies.TYPES.length; i--; ) spawnEnemy(i);
		spawnEnemy(0, -.75 * l.HEIGHT);
		spawnEnemy(1, -1.5 * l.HEIGHT);
		spawnEnemy(2, -1 * l.HEIGHT);
		spawnEnemy(3, -2.25 * l.HEIGHT);
		spawnText('WAVE ' + l.level);
		l.bomb = l.MAX_BOMB;
		play(8);
	}

	enemyLoop:
	for (var i = enemies.length; i--; )
	{
		var y = enemies[i].y + (enemies[i].yOffset || 0);
		// Calculate the angle from the enemy to the players ship, this is used to shoot at the player
		var angle = Math.atan((enemies[i].x - ship.x) / (y - ship.y));
		if (ship.y <= y)
			angle += Math.PI;

		// Calculate the rotation of the enemy graphic
		var bossAngle = (angle + Math.PI) % (Math.PI * 2) - Math.PI;
		var maxAngle = enemies[i].maxAngle || 0;
		if (bossAngle > maxAngle)
			bossAngle = maxAngle;
		else if (bossAngle < -maxAngle)
			bossAngle = -maxAngle;
		enemies[i].angle = ((enemies[i].angle * 29 - bossAngle) / 30);
		//if (enemies[i].angle > maxAngle) enemies[i].angle = maxAngle;
		//if (enemies[i].angle < -maxAngle) enemies[i].angle = -maxAngle;

		//a.drawImage(enemies[i].image, enemies[i].x - enemies[i].r | 0, enemies[i].y - enemies[i].r | 0,
		//	enemies[i].r * 2, enemies[i].r * 2);
		a.save()
		a.translate(enemies[i].x, y);
		a.rotate(enemies[i].angle);
		a.drawImage(enemies[i].image, -enemies[i].r, enemies[i].y - y - enemies[i].r,
			enemies[i].r * 2, enemies[i].r * 2);
		a.restore();

		// All enemies share the same hit box
		var d = enemies[i].r * .6;
		// Visualize the hit box for debugging purposes
		//a.lineWidth = .2;
		//a.strokeStyle = '#FFF';
		//a.strokeRect(enemies[i].x - d, enemies[i].y - d, d * 2, d * 2);
		for (var j = bullets.length; j--; )
		{
			if (bullets[j].y < enemies[i].y + d && bullets[j].y > enemies[i].y - d &&
				bullets[j].x > enemies[i].x - d && bullets[j].x < enemies[i].x + d)
			{
				l.p += 1;
				explode(bullets[j].x, bullets[j].y);
				bullets.splice(j, 1);
				// Hurt the enemy and kill it
				if (--enemies[i].e <= 0)
				{
					l.p += 100;
					spawnBonus(enemies[i]);
					explode(enemies[i].x, enemies[i].y, enemies[i].r * 2);
					explode(enemies[i].x, enemies[i].y, enemies[i].r * 3);
					enemies.splice(i, 1);
					play(10);
					continue enemyLoop;
				}
				else
					play(9);
				break;
			}
		}

		// Move the enemy down
		if (enemies[i].y < enemies[i].yStop)
			enemies[i].y += enemies[i].yAcc || 1;
		// Test only: if (enemies[i].y < 0) enemies[i].y = enemies[i].yStop;

		// Each enemy shoots every few game ticks
		if (--enemies[i].t < 0)
			enemies[i].shoot(angle);
	}

	// Disable additive blending
	a.globalCompositeOperation = 'source-over';

	// Draw the energy bar under the players ship
	if (ship.osd)
	{
		var x = ship.x - 31.5 | 0, y = ship.y + 62.5 | 0;
		var c = ship.e * 512 / 100 | 0;
		a.globalAlpha = ship.osd / ship.MAX_OSD;
		a.fillStyle = '#000';
		a.fillRect(x, y, 64, 4);
		a.fillStyle = 'rgb(' + (c > 255 ? 512 - c : 255) + ',' + (c > 255 ? 255 : c) + ',0)';
		a.fillRect(x, y, ship.e * 64 / 100 | 0, 4);
		a.lineWidth = .5;
		a.strokeStyle = '#FFF';
		a.strokeRect(x, y, 64, 4);
		a.globalAlpha = 1;
		if (ship.e >= 25)
			ship.osd--;
	}

}

// Sound effects, see http://www.superflashbros.net/as3soundEffectsr/
 var soundEffects = [
// 	// 0 = Player shoots (Schuss_004)
// 	'8|0,,.167,.1637,.1361,.7212,.0399,-.363,,,,,,.1314,.0517,,.0154,-.1633,1,,,.0515,,.2',
// 	// 1 = Player is hurt (Treffer_002)
// 	'4|3,.0704,.0462,.3388,.4099,.1599,,.0109,-.3247,.0006,,-.1592,.4477,.1028,.1787,,-.0157,-.3372,.1896,.1628,,.0016,-.0003,.5',
// 	// 2 = Player shield is hit (Treffer_001_Schutzschild)
// 	'4|3,.1,.3899,.1901,.2847,.0399,,.0007,.1492,,,-.9636,,,-.3893,.1636,-.0047,.7799,.1099,-.1103,.5924,.484,.1547,1',
// 	// 3 = Player shield activated (Schutzschild_ein)
// 	'1|1,,.0398,,.4198,.3891,,.4383,,,,,,,,.616,,,1,,,,,.5',
// 	// 4 = Player shield deactivated (Schutzschild_aus)
// 	'1|1,.1299,.27,.1299,.4199,.1599,,.4383,,,,-.6399,,,-.4799,.7099,,,1,,,,,.5',
// 	// 5 = Player get weapon upgrade (Upgrade_001)
// 	'1|0,.43,.1099,.67,.4499,.6999,,-.2199,-.2,.5299,.5299,-.0399,.3,,.0799,.1899,-.1194,.2327,.8815,-.2364,.43,.2099,-.5799,.5',
// 	// 6 = Player collect non-applicable bonus (Einsammeln_002)
// 	'1|0,.2,.1099,.0733,.0854,.14,,-.1891,.36,,,.9826,,,.4642,,-.1194,.2327,.8815,-.2364,.0992,.0076,.2,.5',
// 	// 7 = Player collect money (Einsammeln_001)
// 	'2|0,.09,.1099,.0733,.0854,.1099,,-.1891,.827,,,.9826,,,.4642,,-.1194,.2327,.8815,-.2364,.0992,.0076,.8314,.5',
// 	// 8 = Alarm (new_wave)
// 	'1|1,.1,1,.1901,.2847,.3199,,.0007,.1492,,,-.9636,,,-.3893,.1636,-.0047,.6646,.9653,-.1103,.5924,.484,.1547,.6',
// 	// 9 = Big enemy is hurt (Treffer_001)
// 	'8|3,.1,.3899,.1901,.2847,.0399,,.0007,.1492,,,-.9636,,,-.3893,.1636,-.0047,.6646,.9653,-.1103,.5924,.484,.1547,.4',
// 	// 10 = Big enemy is destroyed (Explosion_001)
// 	'4|3,.2,.1899,.4799,.91,.0599,,-.2199,-.2,.5299,.5299,-.0399,.3,,.0799,.1899,-.1194,.2327,.8815,-.2364,.43,.2099,-.5799,.5',
// 	// 11 = Small torpedo is destroyed (Explosion_003)
// 	'4|3,,.3626,.5543,.191,.0731,,-.3749,,,,,,,,,,,1,,,,,.4',
// 	// 12 = Enemy shoots (Schuss_002)
// 	'4|1,.071,.3474,.0506,.1485,.5799,.2,-.2184,-.1405,.1681,,-.1426,,.9603,-.0961,,.2791,-.8322,.2832,.0009,,.0088,-.0082,.3',
// 	// 13 = Bomb explodes (Bombe)
// 	'1|3,.05,.3365,.4591,.4922,.1051,,.015,,,,-.6646,.7394,,,,,,1,,,,,.7',
// 	// 14 = Player died (Gameover_001)
// 	'1|1,1,.09,.5,.4111,.506,.0942,.1499,.0199,.8799,.1099,-.68,.0268,.1652,.62,.6999,-.0399,.4799,.5199,-.0429,.0599,.8199,-.4199,.7',
// 	// 15 = Player shoots with the smallest weapon (Spielerschuss_001)
// 	'8|2,,.1199,.15,.1361,.5,.0399,-.363,-.4799,,,,,.1314,.0517,,.0154,-.1633,1,,,.0515,,.2',
// 	// 16 = Player shoots with one of the more powerful weapons (Spielerschuss_002)
// 	'8|2,,.98,.4699,.07,.7799,.0399,-.28,-.4799,.2399,.1,,.36,.1314,.0517,,.0154,-.1633,1,,.37,.0399,.54,.1',
// 	// 17 = Players energy is below 25 % (Wenig_Energie)
// 	'1|0,.9705,.0514,.5364,.5273,.4816,.0849,.1422,.205,.7714,.1581,-.7685,.0822,.2147,.6062,.7448,-.0917,.4009,.6251,.1116,.0573,.9005,-.3763,.3',
// 	// 18 = The round enemy 3 shoots (Gegnerschuss_002)
// 	'4|0,.0399,.1362,.0331,.2597,.85,.0137,-.3976,,,,,,.2099,-.72,,,,1,,,,,.3',
// 	// 19 = The smallest enemy 1 shoots (Gegnerschuss_007)
// 	'4|0,,.2863,,.3048,.751,.2,-.316,,,,,,.4416,.1008,,,,1,,,.2962,,.3',
// 	// 20 = The medium enemy 2 shoots (Gegnerschuss_004)
// 	'4|0,,.3138,,.0117,.7877,.1583,-.3391,-.04,,.0464,.0585,,.4085,-.4195,,-.024,-.0396,1,-.0437,.0124,.02,.0216,.3',
// 	// 21 = Intro
// 	'1|0,1,.8799,.3499,.17,.61,.1899,-.3,-.18,.3,.6399,-.0279,.0071,.8,-.1599,.5099,-.46,.5199,.25,.0218,.49,.4,-.2,.3'
];

// This is required to make the "LOADING" message show up on the screen in slower web browsers
window.setTimeout(function()
{
	for (var i = soundEffects.length; i--; )
	{
		var params = soundEffects[i].split('|', 2);
		soundEffects[i] = [];
		soundEffects[i].i = 0;
		if (typeof Audio === 'function')
			try
			{
				// Export for the Closure Compiler
				var url = jsoundEffectsr(params[1]);
				//soundEffects[0].push(new Audio('shot.ogg'));
				for (; params[0]--; )
					soundEffects[i].push(new Audio(url));
			}
			catch (e)
			{
				// This happens in Internet Explorer 9, but I can live with that
				//alert(e);
			}
	}
	interval = window.setInterval(gameloop, 33);
	// Alternative game loop technique
	//gameloop();
	play(21);
}, 0);