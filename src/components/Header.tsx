import { View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { colors } from "@/styles/colors"
import { Link } from "expo-router"

export function Header() {
  return (
    <View className="flex-row justify-between items-center mt-4">
      <Link asChild href="/" className="mt-4">
        <MaterialIcons name="arrow-back" size={24} color={colors.white} />
      </Link>

      <MaterialIcons name="delete" size={24} color={colors.red[500]} />
    </View>
  )
}
