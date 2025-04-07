// ボタンのマッピング
const buttonMapping = {
  0: "×", // Cross
  1: "○", // Circle
  2: "△", // Square
  3: "□", // Triangle
  4: "L1", // L1
  5: "R1", // R1
  6: "L2", // L2
  7: "R2", // R2
  8: "SHARE", // Share
  9: "OPTIONS", // Options
  10: "L3", // L3 (Left Stick Button)
  11: "R3", // R3 (Right Stick Button)
  12: "↑", // D-Pad Up
  13: "↓", // D-Pad Down
  14: "←", // D-Pad Left
  15: "→", // D-Pad Right
  16: "PS", // PS Button
  17: "PAD", // Touchpad Button
}

// 要素の取得
const outputElement = document.getElementById("output")
const statusIndicator = document.getElementById("status-indicator")
const leftStick = document.getElementById("left-stick")
const rightStick = document.getElementById("right-stick")
const leftXValue = document.getElementById("left-x-value")
const leftYValue = document.getElementById("left-y-value")
const rightXValue = document.getElementById("right-x-value")
const rightYValue = document.getElementById("right-y-value")
const l2Value = document.getElementById("l2-value")
const r2Value = document.getElementById("r2-value")

// コントローラー接続イベント
window.addEventListener("gamepadconnected", (event) => {
  console.log("コントローラが接続されました。")
  statusIndicator.textContent = "接続済み"
  statusIndicator.classList.remove("disconnected")
  statusIndicator.classList.add("connected")
  checkGamepad()
})

window.addEventListener("gamepaddisconnected", (event) => {
  console.log("コントローラが切断されました。")
  statusIndicator.textContent = "未接続"
  statusIndicator.classList.remove("connected")
  statusIndicator.classList.add("disconnected")
  outputElement.textContent = "コントローラが切断されました。"

  // すべてのボタンのアクティブ状態をリセット
  resetAllButtonStates()
})

// すべてのボタン状態をリセット
function resetAllButtonStates() {
  for (let i = 0; i < 18; i++) {
    const buttonElement = document.getElementById(`button-${i}`)
    if (buttonElement) {
      buttonElement.classList.remove("active")
    }
  }

  // スティックの位置をリセット
  leftStick.style.transform = "translate(0px, 0px)"
  rightStick.style.transform = "translate(0px, 0px)"

  // 値表示をリセット
  leftXValue.textContent = "0"
  leftYValue.textContent = "0"
  rightXValue.textContent = "0"
  rightYValue.textContent = "0"
  l2Value.textContent = "0"
  r2Value.textContent = "0"
}

// ゲームパッドの状態をチェックして表示を更新
function checkGamepad() {
  const gamepads = navigator.getGamepads()

  if (gamepads) {
    const gamepad = gamepads[0] // 最初のコントローラを使用

    if (gamepad) {
      let outputText = "コントローラ情報:\n"

      // ボタンの状態を更新
      gamepad.buttons.forEach((button, index) => {
        const buttonElement = document.getElementById(`button-${index}`)

        if (buttonElement) {
          // ボタンの視覚的な状態を更新
          if (button.pressed || button.value > 0.1) {
            buttonElement.classList.add("active")
            outputText += `${buttonMapping[index]} が押されています\n`
          } else {
            buttonElement.classList.remove("active")
          }

          // L2/R2の値を更新
          if (index === 6) {
            // L2
            l2Value.textContent = button.value.toFixed(2)
          } else if (index === 7) {
            // R2
            r2Value.textContent = button.value.toFixed(2)
          }
        }
      })

      // スティックの位置を更新
      const maxDistance = 25 // スティックの最大移動距離（ピクセル）

      // 左スティック
      const leftX = gamepad.axes[0]
      const leftY = gamepad.axes[1]
      const leftXPixels = Math.round(leftX * maxDistance)
      const leftYPixels = Math.round(leftY * maxDistance)
      leftStick.style.transform = `translate(${leftXPixels}px, ${leftYPixels}px)`
      leftXValue.textContent = leftX.toFixed(2)
      leftYValue.textContent = leftY.toFixed(2)

      // 右スティック
      const rightX = gamepad.axes[2]
      const rightY = gamepad.axes[3]
      const rightXPixels = Math.round(rightX * maxDistance)
      const rightYPixels = Math.round(rightY * maxDistance)
      rightStick.style.transform = `translate(${rightXPixels}px, ${rightYPixels}px)`
      rightXValue.textContent = rightX.toFixed(2)
      rightYValue.textContent = rightY.toFixed(2)

      outputText += `左スティック: X=${leftX.toFixed(2)}, Y=${leftY.toFixed(2)}\n`
      outputText += `右スティック: X=${rightX.toFixed(2)}, Y=${rightY.toFixed(2)}\n`

      // デバッグ情報を更新
      outputElement.textContent = outputText
    }
  }

  requestAnimationFrame(checkGamepad) // 次のフレームで再チェック
}