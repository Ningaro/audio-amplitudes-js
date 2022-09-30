import {
  ChangeEventHandler,
  LegacyRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Center,
  Code,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'

export default function Example() {
  const canvasElem: LegacyRef<HTMLCanvasElement> = useRef(null)

  const [amplitudes, setAmplitudes] = useState<number[]>([])
  const [fileFakeURL, setFileFakeURL] = useState('')

  useEffect(() => {
    console.log(canvasElem)
  }, [canvasElem])

  const getAmplitudesFromFile: ChangeEventHandler<
    HTMLInputElement
  > = async e => {
    const margin = 10
    const chunkSize = 5000
    const { height } = canvasElem.current!
    const ctx = canvasElem.current!.getContext('2d')
    const centerHeight = Math.ceil(height / 2)
    const scaleFactor = (height - margin * 2) / 2

    // Make sure we have files to use
    if (!e.currentTarget.files!.length) return 0

    // Create a blob that we can use as an src for our audio element
    setFileFakeURL(URL.createObjectURL(e.currentTarget.files![0]))

    const audioContext = new AudioContext()
    const buffer = await e.currentTarget.files![0].arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(buffer)
    const float32Array = [...new Set([...audioBuffer.getChannelData(0)])]

    let array: number[] = []
    let i = 0

    const length = float32Array.length

    while (i < length) {
      array.push(
        float32Array.slice(i, (i += chunkSize)).reduce(function (total, value) {
          return Math.max(total, Math.abs(value))
        })
      )
    }

    canvasElem.current!.width = Math.ceil(
      float32Array.length / chunkSize + margin * 2
    )

    for (let index in array) {
      ctx!.strokeStyle = 'black'
      ctx!.beginPath()
      ctx!.moveTo(
        margin + Number(index),
        centerHeight - array[index] * scaleFactor
      )
      ctx!.lineTo(
        margin + Number(index),
        centerHeight + array[index] * scaleFactor
      )
      ctx!.stroke()
    }
    const maxVal = array.reduce((total, value) => Math.max(total, value), 0)
    console.log(
      maxVal,
      array,
      array.map(val => Math.trunc((val / maxVal) * 100))
    )
    setAmplitudes(array)
  }

  return (
    <Container>
      <Center h="100vh">
        <Stack spacing="4">
          <FormControl>
            <FormLabel>🎧 Аудио файл</FormLabel>
            <Input type="file" onChange={getAmplitudesFromFile} accept=".mp3" />
          </FormControl>
          {fileFakeURL && <audio controls src={fileFakeURL} />}
          <canvas height="100" ref={canvasElem}></canvas>
        </Stack>
      </Center>
    </Container>
  )
}
