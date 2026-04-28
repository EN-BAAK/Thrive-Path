
export type ModalHolderProps = {
  onClose: () => void,
  title: string,
  visible: boolean,
  children: React.ReactNode
}

export type CUModalHolderProps = {
  children: React.ReactNode,
  visible: boolean,
  onClose: () => void,
  title: string
}

export type PageHolderProps = {
  children: React.ReactNode,
}