import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native"

type Props = TouchableOpacityProps & {
  title: string
}

export function Button({ title, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="h-12 w-full bg-blue-500 items-center justify-center rounded-sm mb-8 mt-5"
      {...rest}
    >
      <Text className="text-white text-sm font-semiBold uppercase">
        {title}
      </Text>
    </TouchableOpacity>
  )
}
