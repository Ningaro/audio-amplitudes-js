import { ChangeEventHandler, useState } from 'react'
import {
  Center,
  Code,
  Container,
  FormControl,
  FormLabel,
  Input,
  OrderedList,
  ListItem,
  Stack,
} from '@chakra-ui/react'

export default function InputFromFile() {
  const [amplitudes, setAmplitudes] = useState<number[]>([])
  const [fileFakeURL, setFileFakeURL] = useState('')

  const getAmplitudesFromFile: ChangeEventHandler<
    HTMLInputElement
  > = async e => {
    // Make sure we have files to use
    if (!e.currentTarget.files!.length) return 0

    // Create a blob that we can use as an src for our audio element
    setFileFakeURL(URL.createObjectURL(e.currentTarget.files![0]))

    const audioContext = new AudioContext()
    const buffer = await e.currentTarget.files![0].arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(buffer)
    const audioDuration = Math.trunc(audioBuffer.duration)
    const audioDataFloat32 = audioBuffer.getChannelData(0)

    const audioDataLength = audioDataFloat32.length
    const chunkSize = audioDataLength / (audioDuration * 10)

    const amplitudesValues = [
      ...new Array(Math.floor(audioDataLength / chunkSize)),
    ].map((_, i) => {
      console.log(i)
      return audioDataFloat32
        .slice(i * chunkSize, (i + 1) * chunkSize)
        .reduce((total, value) => Math.max(total, Math.abs(value)))
    })

    const amplitudesValuesMax = amplitudesValues.reduce(
      (total, value) => Math.max(total, value),
      0
    )

    const amplitudesNormalizedValues = amplitudesValues.map(val =>
      Math.trunc((val / amplitudesValuesMax) * 100)
    )

    setAmplitudes(amplitudesNormalizedValues)
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
          {amplitudes.length > 0 ? (
            <OrderedList maxH="40vh" overflowY="auto" pl="16">
              {amplitudes.map((amplitude, i) => (
                <ListItem key={i}>{amplitude} %</ListItem>
              ))}
            </OrderedList>
          ) : (
            <Code maxH="40vh" overflowY="auto">
              'Ваши штуки будут тут...'
            </Code>
          )}
        </Stack>
      </Center>
    </Container>
  )
}
