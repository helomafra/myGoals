import { View, Text } from "react-native"

type Props = {
  title: string
  subtitle: string
}

export function Title({ title, subtitle }: Props) {
  return (
    <View className="pt-12 mb-6">
      <Text className="text-white font-bold text-4xl">{title}</Text>
      <Text className="text-white font-regular text-lg">{subtitle}</Text>
    </View>
  )
}
