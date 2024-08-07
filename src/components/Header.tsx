import { TouchableOpacity, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { colors } from "@/styles/colors"
import { Link } from "expo-router"

type HeaderProps = {
  onDelete: () => void
}

export function Header({ onDelete }: HeaderProps) {
  return (
    <View className="flex-row justify-between items-center mt-4">
      <Link asChild href="/" className="mt-4">
        <MaterialIcons name="arrow-back" size={24} color={colors.white} />
      </Link>

      <TouchableOpacity activeOpacity={0.7} onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color={colors.red[500]} />
      </TouchableOpacity>
    </View>
  )
}
