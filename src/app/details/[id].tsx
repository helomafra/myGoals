import { useEffect, useRef, useState } from "react"
import { Alert, Keyboard, View } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import Bottom from "@gorhom/bottom-sheet"
import dayjs from "dayjs"
import { Input } from "@/components/Input"
import { Title } from "@/components/Title"
import { Button } from "@/components/Button"
import { Loading } from "@/components/Loading"
import { Progress } from "@/components/Progress"
import { BackButton } from "@/components/BackButton"
import { BottomSheet } from "@/components/BottomSheet"
import { Transactions } from "@/components/Transactions"
import { TransactionProps } from "@/components/Transaction"
import { TransactionTypeSelect } from "@/components/TransactionTypeSelect"
import { currencyFormat } from "@/utils/currencyFormat"
import { useGoalRepository } from "@/database/useGoalRepository"
import { useTransactionRepository } from "@/database/useTransactionRepository"
import { Header } from "@/components/Header"

type Details = {
  name: string
  total: string
  current: string
  percentage: number
  transactions: TransactionProps[]
}

export default function Details() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState<"up" | "down">("up")
  const [goal, setGoal] = useState<Details>({} as Details)
  const [total, setTotal] = useState("")

  const routeParams = useLocalSearchParams()
  const goalId = Number(routeParams.id)

  const transactionBottomSheetRef = useRef<Bottom>(null)
  const handleTransactionBottomSheetOpen = () =>
    transactionBottomSheetRef.current?.expand()
  const handleTransactionBottomSheetClose = () =>
    transactionBottomSheetRef.current?.snapToIndex(0)

  const goalBottomSheetRef = useRef<Bottom>(null)
  const handleGoalBottomSheetOpen = () => goalBottomSheetRef.current?.expand()
  const handleGoalBottomSheetClose = () =>
    goalBottomSheetRef.current?.snapToIndex(0)

  const useGoal = useGoalRepository()
  const useTransaction = useTransactionRepository()

  function fetchDetails() {
    try {
      if (goalId) {
        const goal = useGoal.showDetails(goalId)
        const transactions = useTransaction.findByGoal(goalId)

        if (!goal || !transactions) {
          return router.back()
        }
        setTotal(String(goal.total))
        setGoal({
          name: goal.name,
          current: currencyFormat(goal.current),
          total: currencyFormat(goal.total),
          percentage: (goal.current / goal.total) * 100,
          transactions: transactions.map((item) => ({
            ...item,
            date: dayjs(item.created_at).format("DD/MM/YY   hh:mm A"),
          })),
        })

        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleNewTransaction() {
    try {
      let amountAsNumber = Number(amount.replace(",", "."))

      if (isNaN(amountAsNumber)) {
        return Alert.alert("Error", "Invalid value.")
      }

      if (type === "down") {
        amountAsNumber = amountAsNumber * -1
      }

      useTransaction.create({ amount: amountAsNumber, goalId })

      Alert.alert("Success", "Transaction recorded!")

      handleTransactionBottomSheetClose()
      Keyboard.dismiss()

      setAmount("")
      setType("up")

      fetchDetails()
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteGoal() {
    try {
      useGoal.deleteGoal(goalId)
      Alert.alert("Success", "Goal deleted successfully!")
      router.back()
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Could not delete the goal.")
    }
  }

  async function editGoal() {
    try {
      const totalAsNumber = Number(total.toString().replace(",", "."))

      if (isNaN(totalAsNumber)) {
        return Alert.alert("Error", "Invalid value.")
      }

      useGoal.updateGoalTotal(goalId, totalAsNumber)
      Alert.alert("Success", "Goal updated successfully!")
      router.back()
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Could not update the goal.")
    }
  }

  function handleDeleteConfirmation() {
    Alert.alert("Delete Goal", "Do you really wish to delete this goal?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: deleteGoal,
        style: "destructive",
      },
    ])
  }

  useEffect(() => {
    fetchDetails()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className="flex-1 p-8 pt-12">
      <Header
        onDelete={handleDeleteConfirmation}
        onUpdate={handleGoalBottomSheetOpen}
      />

      <Title title={goal.name} subtitle={`${goal.current} of ${goal.total}`} />

      <Progress percentage={goal.percentage} />

      <Transactions transactions={goal.transactions} />

      <Button
        title="New transaction"
        onPress={handleTransactionBottomSheetOpen}
      />

      <BottomSheet
        ref={transactionBottomSheetRef}
        title="New transaction"
        snapPoints={[0.01, 284]}
        onClose={handleTransactionBottomSheetClose}
      >
        <TransactionTypeSelect onChange={setType} selected={type} />

        <Input
          placeholder="Value"
          keyboardType="numeric"
          onChangeText={setAmount}
          value={amount}
        />

        <Button title="Save" onPress={handleNewTransaction} />
      </BottomSheet>

      <BottomSheet
        ref={goalBottomSheetRef}
        title="Update goal"
        snapPoints={[0.01, 284]}
        onClose={handleGoalBottomSheetClose}
      >
        <Input placeholder="Goal" value={goal.name} editable={false} />

        <Input
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
          placeholder="Enter the new goal total"
        />

        <Button title="Update" onPress={editGoal} />
      </BottomSheet>
    </View>
  )
}
