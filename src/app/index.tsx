import { useEffect, useRef, useState } from "react"
import { Alert, View, Keyboard } from "react-native"
import Bottom from "@gorhom/bottom-sheet"
import { router } from "expo-router"
import dayjs from "dayjs"
import { Input } from "@/components/Input"
import { Title } from "@/components/Title"
import { Button } from "@/components/Button"
import { BottomSheet } from "@/components/BottomSheet"
import { Goals, GoalsProps } from "@/components/Goals"
import { Transactions, TransactionsProps } from "@/components/Transactions"
import { useGoalRepository } from "@/database/useGoalRepository"
import { useTransactionRepository } from "@/database/useTransactionRepository"

export default function Home() {
  const [transactions, setTransactions] = useState<TransactionsProps>([])
  const [goals, setGoals] = useState<GoalsProps>([])

  const [name, setName] = useState("")
  const [total, setTotal] = useState("")

  const useGoal = useGoalRepository()
  const useTransaction = useTransactionRepository()

  const bottomSheetRef = useRef<Bottom>(null)
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand()
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0)

  function handleDetails(id: string) {
    router.navigate("/details/" + id)
  }

  async function handleCreate() {
    try {
      const totalAsNumber = Number(total.toString().replace(",", "."))

      if (isNaN(totalAsNumber)) {
        return Alert.alert("Error", "Invalid value.")
      }

      useGoal.create({ name, total: totalAsNumber })

      Keyboard.dismiss()
      handleBottomSheetClose()
      Alert.alert("Success", "Goal registered!")

      setName("")
      setTotal("")
      fetchGoals()
    } catch (error) {
      Alert.alert("Error", "Unable to register.")
      console.log(error)
    }
  }

  async function fetchGoals() {
    try {
      const response = useGoal.list()
      setGoals(response)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchTransactions() {
    try {
      const response = useTransaction.findLatest()

      setTransactions(
        response.map((item) => ({
          ...item,
          date: dayjs(item.created_at).format("DD/MM/YY   hh:mm A"),
        }))
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGoals()
    fetchTransactions()
  }, [])

  return (
    <View className="flex-1 p-8 pt-12">
      <Title
        title="myGoals"
        subtitle="Save today to reap the rewards tomorrow."
      />

      <Goals
        goals={goals}
        onAdd={handleBottomSheetOpen}
        onPress={handleDetails}
      />

      <Transactions transactions={transactions} />

      <BottomSheet
        ref={bottomSheetRef}
        title="New goal"
        //snapPoints [high when closed, when open]
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <Input placeholder="Goal" onChangeText={setName} value={name} />

        <Input
          placeholder="Value to save"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />

        <Button title="Create" onPress={handleCreate} />
      </BottomSheet>
    </View>
  )
}
