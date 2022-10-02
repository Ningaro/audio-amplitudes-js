import {
  ChangeEventHandler,
  ReactEventHandler,
  useEffect,
  useState,
} from 'react'
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
  Spinner,
} from '@chakra-ui/react'

async function DownloadFullFile(urlToFile: string) {
  try {
    const fetchData = await fetch(urlToFile)
    return fetchData.blob()
  } catch (e) {
    console.error(e)
  }
}

export default function FromFileLink() {
  const audioURL = 'https://storage.yandexcloud.net/audio-files-test/audio.mp3'

  const [amplitudes, setAmplitudes] = useState<number[]>([])
  const [fileFakeURL, setFileFakeURL] = useState('')
  const [dataLoadedAndCalculate, setDataLoadedAndCalculate] = useState(false)

  // Получаем данные о, аудио файле и сохраняем их в useState
  useEffect(() => {
    async function main() {
      const blob = await DownloadFullFile(audioURL)

      // Make sure we have file data
      if (!blob) return 0

      // Create a blob that we can use as an src for our audio element
      setFileFakeURL(URL.createObjectURL(blob))

      const audioContext = new AudioContext()
      const buffer = await blob.arrayBuffer()
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
      setDataLoadedAndCalculate(true)
    }

    main()
  }, [])

  return (
    <Container>
      <Center h="100vh">
        {dataLoadedAndCalculate ? (
          <Stack spacing="4">
            <FormControl>
              <FormLabel userSelect="none">🎧 Аудио файл</FormLabel>
              <audio controls src={fileFakeURL} />
            </FormControl>
            <OrderedList maxH="40vh" overflowY="auto" pl="16">
              {amplitudes.map((amplitude, i) => (
                <ListItem key={i}>{amplitude} %</ListItem>
              ))}
            </OrderedList>
          </Stack>
        ) : (
          <Spinner />
        )}
      </Center>
    </Container>
  )
}
