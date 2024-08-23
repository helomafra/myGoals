import { TouchableOpacity, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { colors } from "@/styles/colors"
import { Link } from "expo-router"

type HeaderProps = {
  onDelete: () => void
  onUpdate: () => void
}

export function Header({ onDelete, onUpdate }: HeaderProps) {
  return (
    <View className="flex-row justify-between mt-8">
      <Link asChild href="/">
        <MaterialIcons name="arrow-back" size={24} color={colors.white} />
      </Link>

      <View className="flex-row items-center gap-6">
        <TouchableOpacity activeOpacity={0.7} onPress={onUpdate}>
          <MaterialIcons name="edit" size={24} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={onDelete}>
          <MaterialIcons name="delete" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
