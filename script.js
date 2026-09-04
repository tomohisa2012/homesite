const app = document.getElementById("app");
const buttons = document.querySelectorAll(".tool-btn");

let timerInterval = null;
let timerSeconds = 300;

const tools = {

password: {
title: "パスワード生成",
desc: "ランダムなパスワードを作ります。",

```
html: `
  <label>長さ</label>

  <div class="row">
    <input id="pwLen" type="number" min="4" max="128" value="16">
    <button class="action" id="genPw">生成</button>
  </div>

  <label>使用する文字</label>

  <input
    id="pwChars"
    value="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*"
  >

  <div class="output big-output" id="pwOut">
    ここに生成結果が表示されます
  </div>

  <button class="action" id="copyPw">
    コピー
  </button>
`,

init() {

  const generate = () => {

    const length = Math.max(
      4,
      Math.min(128, Number(pwLen.value) || 16)
    );

    const chars =
      pwChars.value ||
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const random =
      new Uint32Array(length);

    crypto.getRandomValues(random);

    let result = "";

    for (const value of random) {
      result += chars[value % chars.length];
    }

    pwOut.textContent = result;
  };

  genPw.onclick = generate;

  copyPw.onclick = () => {
    navigator.clipboard?.writeText(
      pwOut.textContent
    );
  };

  generate();
}
```

},

counter: {

```
title: "文字数カウント",
desc: "文字・空白・行数・単語数を数えます。",

html: `
  <textarea
    id="countText"
    placeholder="ここに文章を入力..."
  ></textarea>

  <div id="stats"></div>
`,

init() {

  const update = () => {

    const text = countText.value;

    const chars = text.length;

    const noSpaces =
      text.replace(/\s/g, "").length;

    const lines =
      text ? text.split("\n").length : 0;

    const words =
      text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    stats.innerHTML = `
      <span class="stat">
        文字数: <b>${chars}</b>
      </span>

      <span class="stat">
        空白除外: <b>${noSpaces}</b>
      </span>

      <span class="stat">
        行数: <b>${lines}</b>
      </span>

      <span class="stat">
        単語数: <b>${words}</b>
      </span>
    `;
  };

  countText.oninput = update;

  update();
}
```

},

case: {

```
title: "文字変換",
desc: "英字を大文字・小文字に変換します。",

html: `
  <textarea
    id="caseText"
    placeholder="Text to transform..."
  ></textarea>

  <div class="row">

    <button class="action" id="upper">
      大文字
    </button>

    <button class="action" id="lower">
      小文字
    </button>

    <button class="action" id="trim">
      空白整理
    </button>

  </div>
`,

init() {

  upper.onclick = () => {
    caseText.value =
      caseText.value.toUpperCase();
  };

  lower.onclick = () => {
    caseText.value =
      caseText.value.toLowerCase();
  };

  trim.onclick = () => {
    caseText.value =
      caseText.value
        .trim()
        .replace(/\s+/g, " ");
  };
}
```

},

calculator: {

```
title: "計算機",
desc: "四則演算をすばやく計算できます。",

html: `
  <div class="calc">

    <input
      id="calcDisplay"
      readonly
      value="0"
    >

    <div class="calc-grid">

      ${[
        "7","8","9","÷",
        "4","5","6","×",
        "1","2","3","-",
        "0",".","C","+",
        "(",")","=","⌫"
      ]
      .map(
        x => `<button class="action calcKey">${x}</button>`
      )
      .join("")}

    </div>

  </div>
`,

init() {

  document
    .querySelectorAll(".calcKey")
    .forEach(button => {

      button.onclick = () => {

        const value =
          button.textContent;

        if (value === "C") {

          calcDisplay.value = "0";

        } else if (value === "⌫") {

          calcDisplay.value =
            calcDisplay.value.slice(0, -1) || "0";

        } else if (value === "=") {

          try {

            const expression =
              calcDisplay.value
                .replaceAll("×", "*")
                .replaceAll("÷", "/");

            if (
              !/^[0-9+\-*/(). ]+$/.test(expression)
            ) {
              throw new Error();
            }

            calcDisplay.value =
              String(Function(
                "return " + expression
              )());

          } catch {

            calcDisplay.value = "Error";
          }

        } else {

          if (
            calcDisplay.value === "0" &&
            /[0-9.]/.test(value)
          ) {
            calcDisplay.value = value;
          } else {
            calcDisplay.value += value;
          }

        }
      };

    });
}
```

},

color: {

```
title: "カラー変換",
desc: "HEXカラーをRGBに変換します。",

html: `
  <label>HEX</label>

  <div class="row">

    <input
      id="hex"
      value="#3a6ea5"
    >

    <input
      id="picker"
      type="color"
      value="#3a6ea5"
      style="max-width:70px;height:42px"
    >

  </div>

  <div
    class="output"
    id="rgbOut"
  ></div>

  <div
    class="color-preview"
    id="preview"
  ></div>
`,

init() {

  const update = () => {

    let value =
      hex.value.trim();

    if (
      !/^#?[0-9a-f]{6}$/i.test(value)
    ) {
      return;
    }

    value =
      value.replace("#", "");

    const r =
      parseInt(value.slice(0, 2), 16);

    const g =
      parseInt(value.slice(2, 4), 16);

    const b =
      parseInt(value.slice(4), 16);

    rgbOut.textContent =
      `RGB(${r}, ${g}, ${b})`;

    preview.style.background =
      "#" + value;

    picker.value =
      "#" + value;
  };

  hex.oninput = update;

  picker.oninput = () => {
    hex.value = picker.value;
    update();
  };

  update();
}
```

},

url: {

```
title: "URLエンコード / デコード",
desc: "URLをエンコード・デコードします。",

html: `
  <textarea
    id="urlText"
    placeholder="https://example.com/こんにちは"
  ></textarea>

  <div class="row">

    <button
      class="action"
      id="encode"
    >
      エンコード
    </button>

    <button
      class="action"
      id="decode"
    >
      デコード
    </button>

  </div>
`,

init() {

  encode.onclick = () => {

    try {
      urlText.value =
        encodeURIComponent(
          urlText.value
        );
    } catch {}
  };

  decode.onclick = () => {

    try {

      urlText.value =
        decodeURIComponent(
          urlText.value
        );

    } catch {

      alert(
        "デコードできませんでした"
      );

    }
  };
}
```

},

json: {

```
title: "JSON整形",
desc: "JSONを見やすく整形・圧縮します。",

html: `
  <textarea
    id="jsonText"
    placeholder='{"name":"QuickTools","version":1}'
  ></textarea>

  <div class="row">

    <button
      class="action"
      id="pretty"
    >
      整形
    </button>

    <button
      class="action"
      id="minify"
    >
      圧縮
    </button>

  </div>

  <div
    class="output"
    id="jsonOut"
  ></div>
`,

init() {

  pretty.onclick = () => {

    try {

      jsonOut.textContent =
        JSON.stringify(
          JSON.parse(jsonText.value),
          null,
          2
        );

    } catch (error) {

      jsonOut.textContent =
        "JSONエラー: " +
        error.message;
    }
  };


  minify.onclick = () => {

    try {

      jsonOut.textContent =
        JSON.stringify(
          JSON.parse(jsonText.value)
        );

    } catch (error) {

      jsonOut.textContent =
        "JSONエラー: " +
        error.message;
    }
  };
}
```

},

uuid: {

```
title: "UUID生成",
desc: "ランダムUUIDをまとめて生成します。",

html: `
  <label>個数</label>

  <input
    id="uuidCount"
    type="number"
    min="1"
    max="50"
    value="5"
  >

  <button
    class="action"
    id="genUuid"
  >
    生成
  </button>

  <div
    class="output"
    id="uuidOut"
  ></div>
`,

init() {

  genUuid.onclick = () => {

    const count =
      Math.max(
        1,
        Math.min(
          50,
          Number(uuidCount.value) || 5
        )
      );

    uuidOut.textContent =
      Array.from(
        { length: count },
        () => crypto.randomUUID()
      ).join("\n");
  };

  genUuid.click();
}
```

},

timer: {

```
title: "タイマー",
desc: "分・秒を指定してカウントダウンします。",

html: `
  <div
    class="timer-display"
    id="timerDisplay"
  >
    05:00
  </div>

  <div class="row">

    <input
      id="minutes"
      type="number"
      min="0"
      value="5"
    >

    <input
      id="seconds"
      type="number"
      min="0"
      max="59"
      value="0"
    >

  </div>

  <div class="row">

    <button
      class="action"
      id="startTimer"
    >
      開始
    </button>

    <button
      class="action"
      id="pauseTimer"
    >
      一時停止
    </button>

    <button
      class="action"
      id="resetTimer"
    >
      リセット
    </button>

  </div>
`,

init() {

  clearInterval(timerInterval);

  timerSeconds = 300;

  const render = () => {

    timerDisplay.textContent =
      String(
        Math.floor(timerSeconds / 60)
      ).padStart(2, "0")
      +
      ":"
      +
      String(
        timerSeconds % 60
      ).padStart(2, "0");
  };

  render();


  startTimer.onclick = () => {

    if (timerInterval) return;

    timerInterval =
      setInterval(() => {

        if (timerSeconds <= 0) {

          clearInterval(
            timerInterval
          );

          timerInterval = null;

          alert(
            "タイマー終了！"
          );

          return;
        }

        timerSeconds--;

        render();

      }, 1000);
  };


  pauseTimer.onclick = () => {

    clearInterval(
      timerInterval
    );

    timerInterval = null;
  };


  resetTimer.onclick = () => {

    clearInterval(
      timerInterval
    );

    timerInterval = null;

    timerSeconds =
      (Number(minutes.value) || 0) * 60
      +
      (Number(seconds.value) || 0);

    render();
  };
}
```

},

textfile: {

```
title: "テキストファイル保存",
desc: "文章を.txtファイルとして保存します。",

html: `
  <label>ファイル名</label>

  <input
    id="fileName"
    value="memo.txt"
  >

  <label>本文</label>

  <textarea
    id="fileText"
    placeholder="保存したい文章..."
  ></textarea>

  <button
    class="action"
    id="saveText"
  >
    ダウンロード
  </button>
`,

init() {

  saveText.onclick = () => {

    let name =
      fileName.value.trim()
      || "memo.txt";

    if (!name.endsWith(".txt")) {
      name += ".txt";
    }

    const blob =
      new Blob(
        [fileText.value],
        {
          type:
            "text/plain;charset=utf-8"
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = name;

    link.click();

    setTimeout(
      () => URL.revokeObjectURL(url),
      1000
    );
  };
}
```

}
};

function loadTool(name) {

buttons.forEach(button => {

```
button.classList.toggle(
  "active",
  button.dataset.tool === name
);
```

});

const tool =
tools[name];

app.innerHTML = ` <div class="card">

```
  <h1>${tool.title}</h1>

  <div class="desc">
    ${tool.desc}
  </div>

  ${tool.html}

</div>
```

`;

tool.init();
}

buttons.forEach(button => {

button.onclick = () => {
loadTool(
button.dataset.tool
);
};

});

loadTool("password");
