import dayjs from "dayjs"
import "dayjs/locale/en-nz"
import advancedFormat from "dayjs/plugin/advancedFormat"

dayjs.locale("en-nz")
dayjs.extend(advancedFormat)
