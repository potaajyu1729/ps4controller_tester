// ボタンのマッピング
const buttonMapping = {
  0: "×", // Cross
  1: "○", // Circle
  2: "△", // Triangle
  3: "□", // Square
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

// 仮想ボタン状態（コントローラーが接続されていない場合に使用）
const virtualButtonStates = {}
for (let i = 0; i < 18; i++) {
  virtualButtonStates[i] = false
}

// 仮想スティック状態
const virtualStickStates = {
  left: { x: 0, y: 0 },
  right: { x: 0, y: 0 },
}

// コントローラー接続状態
let controllerConnected = false

// コントローラー接続イベント
window.addEventListener("gamepadconnected", (event) => {
  console.log("コントローラが接続されました。")
  statusIndicator.textContent = "接続済み"
  statusIndicator.classList.remove("disconnected")
  statusIndicator.classList.add("connected")
  controllerConnected = true
  checkGamepad()
})

window.addEventListener("gamepaddisconnected", (event) => {
  console.log("コントローラが切断されました。")
  statusIndicator.textContent = "未接続"
  statusIndicator.classList.remove("connected")
  statusIndicator.classList.add("disconnected")
  outputElement.textContent = "コントローラが切断されました。"
  controllerConnected = false

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
    virtualButtonStates[i] = false
  }

  // スティックの位置をリセット
  leftStick.style.transform = "translate(0px, 0px)"
  rightStick.style.transform = "translate(0px, 0px)"
  virtualStickStates.left = { x: 0, y: 0 }
  virtualStickStates.right = { x: 0, y: 0 }

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
  let outputText = ""

  if (controllerConnected) {
    const gamepads = navigator.getGamepads()

    if (gamepads) {
      const gamepad = gamepads[0] // 最初のコントローラを使用

      if (gamepad) {
        outputText = "コントローラ情報:\n"

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
      }
    }
  } else {
    // 仮想コントローラーの状態を表示
    outputText = "仮想コントローラー情報:\n"

    // 仮想ボタンの状態を表示
    for (const [index, pressed] of Object.entries(virtualButtonStates)) {
      if (pressed) {
        outputText += `${buttonMapping[index]} が押されています\n`
      }
    }

    // 仮想スティックの状態を表示
    outputText += `左スティック: X=${virtualStickStates.left.x.toFixed(2)}, Y=${virtualStickStates.left.y.toFixed(2)}\n`
    outputText += `右スティック: X=${virtualStickStates.right.x.toFixed(2)}, Y=${virtualStickStates.right.y.toFixed(2)}\n`
  }

  // デバッグ情報を更新
  outputElement.textContent = outputText

  requestAnimationFrame(checkGamepad) // 次のフレームで再チェック
}

// タッチ/マウスイベントの初期化
function initTouchEvents() {
  // 通常のボタン
  document.querySelectorAll("[data-button]").forEach((button) => {
    ;["mousedown", "touchstart"].forEach((eventType) => {
      button.addEventListener(eventType, (e) => {
        e.preventDefault()
        const buttonId = Number.parseInt(button.dataset.button)
        virtualButtonStates[buttonId] = true
        button.classList.add("active")
      })
    })
    ;["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((eventType) => {
      button.addEventListener(eventType, (e) => {
        e.preventDefault()
        const buttonId = Number.parseInt(button.dataset.button)
        virtualButtonStates[buttonId] = false
        button.classList.remove("active")
      })
    })
  })

  // スティックのドラッグ
  initStickDrag(leftStick, "left")
  initStickDrag(rightStick, "right")
}

// スティックのドラッグ機能
function initStickDrag(stickElement, stickId) {
  let isDragging = false
  let startX, startY
  let currentX = 0,
    currentY = 0
  const maxDistance = 25 // スティックの最大移動距離（ピクセル）

  // マウスイベント
  stickElement.addEventListener("mousedown", (e) => {
    isDragging = true
    startX = e.clientX
    startY = e.clientY
    stickElement.style.cursor = "grabbing"
    e.preventDefault()
  })

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    // 移動距離を制限
    currentX = Math.max(-maxDistance, Math.min(maxDistance, deltaX))
    currentY = Math.max(-maxDistance, Math.min(maxDistance, deltaY))

    // スティックを移動
    stickElement.style.transform = `translate(${currentX}px, ${currentY}px)`

    // 正規化された値（-1.0 から 1.0）
    const normalizedX = currentX / maxDistance
    const normalizedY = currentY / maxDistance

    // 値を更新
    if (stickId === "left") {
      leftXValue.textContent = normalizedX.toFixed(2)
      leftYValue.textContent = normalizedY.toFixed(2)
      virtualStickStates.left.x = normalizedX
      virtualStickStates.left.y = normalizedY
    } else {
      rightXValue.textContent = normalizedX.toFixed(2)
      rightYValue.textContent = normalizedY.toFixed(2)
      virtualStickStates.right.x = normalizedX
      virtualStickStates.right.y = normalizedY
    }
  })

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false
      stickElement.style.cursor = "grab"

      // スティックを中央に戻す
      stickElement.style.transform = "translate(0px, 0px)"

      // 値をリセット
      if (stickId === "left") {
        leftXValue.textContent = "0"
        leftYValue.textContent = "0"
        virtualStickStates.left.x = 0
        virtualStickStates.left.y = 0
      } else {
        rightXValue.textContent = "0"
        rightYValue.textContent = "0"
        virtualStickStates.right.x = 0
        virtualStickStates.right.y = 0
      }
    }
  })

  // タッチイベント
  stickElement.addEventListener("touchstart", (e) => {
    isDragging = true
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    e.preventDefault()
  })

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY

    // 移動距離を制限
    currentX = Math.max(-maxDistance, Math.min(maxDistance, deltaX))
    currentY = Math.max(-maxDistance, Math.min(maxDistance, deltaY))

    // スティックを移動
    stickElement.style.transform = `translate(${currentX}px, ${currentY}px)`

    // 正規化された値（-1.0 から 1.0）
    const normalizedX = currentX / maxDistance
    const normalizedY = currentY / maxDistance

    // 値を更新
    if (stickId === "left") {
      leftXValue.textContent = normalizedX.toFixed(2)
      leftYValue.textContent = normalizedY.toFixed(2)
      virtualStickStates.left.x = normalizedX
      virtualStickStates.left.y = normalizedY
    } else {
      rightXValue.textContent = normalizedX.toFixed(2)
      rightYValue.textContent = normalizedY.toFixed(2)
      virtualStickStates.right.x = normalizedX
      virtualStickStates.right.y = normalizedY
    }

    e.preventDefault()
  })

  window.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false

      // スティックを中央に戻す
      stickElement.style.transform = "translate(0px, 0px)"

      // 値をリセット
      if (stickId === "left") {
        leftXValue.textContent = "0"
        leftYValue.textContent = "0"
        virtualStickStates.left.x = 0
        virtualStickStates.left.y = 0
      } else {
        rightXValue.textContent = "0"
        rightYValue.textContent = "0"
        virtualStickStates.right.x = 0
        virtualStickStates.right.y = 0
      }
    }
  })

  window.addEventListener("touchcancel", () => {
    if (isDragging) {
      isDragging = false

      // スティックを中央に戻す
      stickElement.style.transform = "translate(0px, 0px)"

      // 値をリセット
      if (stickId === "left") {
        leftXValue.textContent = "0"
        leftYValue.textContent = "0"
        virtualStickStates.left.x = 0
        virtualStickStates.left.y = 0
      } else {
        rightXValue.textContent = "0"
        rightYValue.textContent = "0"
        virtualStickStates.right.x = 0
        virtualStickStates.right.y = 0
      }
    }
  })
}

// 初期化
initTouchEvents()
checkGamepad() // ゲームパッドのチェックを開始
