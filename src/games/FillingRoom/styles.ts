import styled, {
  FlattenSimpleInterpolation,
} from 'styled-components'

export const Furniture =
  styled.img <
  { position: FlattenSimpleInterpolation } >
  `
position: absolute;
width: 20%;
${({ position }) => position}
`
