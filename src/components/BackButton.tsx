import { Link } from "expo-router"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { colors } from "@/styles/colors"

export function BackButton() {
  return (
    <Link asChild href="/" className="mt-4">
      <MaterialIcons name="arrow-back" size={36} color={colors.white} />
    </Link>
  )
}
