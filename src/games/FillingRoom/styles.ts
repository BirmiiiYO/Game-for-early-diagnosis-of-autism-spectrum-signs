import styled, {
  FlattenSimpleInterpolation,
} from 'styled-components'

export const Furniture =
  styled.img <
  { styles: FlattenSimpleInterpolation } >
  `
position: absolute;
${({ styles }) => styles}
@media (max-width: 768px) {
  flex-direction: column;
  max-height:150px;
}
`
