const app = document.getElementById("app");


// ================================
// 共通
// ================================

function copyText(text) {

  navigator.clipboard.writeText(text)
    .then(() => alert("コピーしました！"))
    .catch(() => alert("コピーできませんでした"));

}


// ================================
// ホーム
// ================================

function home() {

  app.innerHTML = `

    <div class="card">

      <h1>🛠️ QuickTools</h1>

      <p>
        ブラウザだけで使える便利ツール集です。
      </p>

      <div class="grid">

        <div class="tile" onclick="loadTool('password')">
          🔑 <b>パスワード生成</b><br>
          ランダムなパスワードを生成
        </div>

        <div class="tile" onclick="loadTool('counter')">
          🔢 <b>文字数カウント</b><br>
          文字数や行数を計測
        </div>

        <div class="tile" onclick="loadTool('calculator')">
          🧮 <b>電卓</b><br>
          普通の計算機
        </div>

        <div class="tile" onclick="loadTool('color')">
          🎨 <b>HEX / RGB</b><br>
          色コードを変換
        </div>

        <div class="tile" onclick="loadTool('url')">
          🔗 <b>URL変換</b><br>
          URLエンコード・デコード
        </div>

        <div class="tile" onclick="loadTool('json')">
          📋 <b>JSON整形</b><br>
          JSONを見やすくする
        </div>

        <div class="tile" onclick="loadTool('uuid')">
          🆔 <b>UUID生成</b><br>
          UUIDを生成
        </div>

        <div class="tile" onclick="loadTool('timer')">
          ⏱️ <b>タイマー</b><br>
          カウントダウン
        </div>

        <div class="tile" onclick="loadTool('textfile')">
          📄 <b>TXT作成</b><br>
          テキストファイルを保存
        </div>

      </div>

    </div>

  `;

}


// ================================
// パスワード生成
// ================================

function passwordTool() {

  app.innerHTML = `

    <div class="card">

      <h1>🔑 パスワード生成</h1>

      <label>
        長さ：
        <span id="lengthValue">20</span>
      </label>

      <input
        id="passwordLength"
        type="range"
        min="6"
        max="64"
        value="20"
      >

      <div
        class="output"
        id="passwordOutput"
      ></div>

      <div class="row">

        <button
          class="action"
          id="generatePassword"
        >
          🔄 生成
        </button>

        <button
          class="action"
          id="copyPassword"
        >
          📋 コピー
        </button>

      </div>

    </div>

  `;


  const range =
    document.getElementById("passwordLength");

  const lengthValue =
    document.getElementById("lengthValue");

  const output =
    document.getElementById("passwordOutput");


  range.oninput = () => {

    lengthValue.textContent =
      range.value;

  };


  function generate() {

    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZ" +
      "abcdefghijkmnopqrstuvwxyz" +
      "23456789!@#$%&*+-=?";

    const values =
      new Uint32Array(
        Number(range.value)
      );

    crypto.getRandomValues(values);

    output.textContent =
      [...values]
        .map(v => chars[v % chars.length])
        .join("");

  }


  document
    .getElementById("generatePassword")
    .onclick = generate;


  document
    .getElementById("copyPassword")
    .onclick = () =>
      copyText(output.textContent);


  generate();

}


// ================================
// 文字数
// ================================

function counterTool() {

  app.innerHTML = `

    <div class="card">

      <h1>🔢 文字数カウント</h1>

      <textarea
        id="counterText"
        placeholder="ここに文章を入力してください"
      ></textarea>

      <div
        class="output"
        id="counterOutput"
      ></div>

    </div>

  `;


  const text =
    document.getElementById("counterText");

  const output =
    document.getElementById("counterOutput");


  function update() {

    const value = text.value;

    const characters =
      [...value].length;

    const noSpace =
      [...value]
        .filter(c => !/\s/.test(c))
        .length;

    const lines =
      value === ""
        ? 0
        : value.split(/\r?\n/).length;

    const bytes =
      new TextEncoder()
        .encode(value)
        .length;


    output.textContent =
`文字数：${characters}
空白を除いた文字数：${noSpace}
行数：${lines}
UTF-8バイト数：${bytes}`;

  }


  text.oninput = update;

  update();

}


// ================================
// 電卓
// ================================

function calculatorTool() {

  app.innerHTML = `

    <div class="card calculator">

      <h1>🧮 電卓</h1>

      <input
        id="calcInput"
        placeholder="例：12 + 3 * 4"
      >

      <div class="row">

        <button
          class="action"
          id="calculate"
        >
          =
        </button>

        <button
          class="action"
          id="clearCalculator"
        >
          C
        </button>

      </div>

      <div
        class="output"
        id="calcOutput"
      ></div>

      <div class="keys">

        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button>/</button>

        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>*</button>

        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>-</button>

        <button>0</button>
        <button>.</button>
        <button>(</button>
        <button>)</button>

        <button>+</button>
        <button>%</button>

      </div>

    </div>

  `;


  const input =
    document.getElementById("calcInput");

  const output =
    document.getElementById("calcOutput");


  document
    .querySelectorAll(".keys button")
    .forEach(button => {

      button.onclick = () => {

        input.value +=
          button.textContent;

      };

    });


  document
    .getElementById("calculate")
    .onclick = () => {

      try {

        const expression =
          input.value;

        // 許可する文字だけに限定
        if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {

          throw new Error(
            "使用できない文字があります"
          );

        }

        // Function / eval は使用しない
        const result =
          simpleCalculate(expression);

        output.textContent =
          result;

      }

      catch (error) {

        output.textContent =
          "エラー："
          + error.message;

      }

    };


  document
    .getElementById("clearCalculator")
    .onclick = () => {

      input.value = "";
      output.textContent = "";

    };


  input.onkeydown = event => {

    if (event.key === "Enter") {

      document
        .getElementById("calculate")
        .click();

    }

  };

}


// 簡易四則演算
function simpleCalculate(expression) {

  expression =
    expression.replace(/\s/g, "");

  let position = 0;


  function expressionPart() {

    let value = term();

    while (
      expression[position] === "+" ||
      expression[position] === "-"
    ) {

      const operator =
        expression[position++];

      const next =
        term();

      if (operator === "+")
        value += next;

      else
        value -= next;

    }

    return value;

  }


  function term() {

    let value = unary();

    while (
      expression[position] === "*" ||
      expression[position] === "/" ||
      expression[position] === "%"
    ) {

      const operator =
        expression[position++];

      const next =
        unary();


      if (operator === "*")
        value *= next;

      else if (operator === "/") {

        if (next === 0)
          throw new Error("0では割れません");

        value /= next;

      }

      else
        value %= next;

    }

    return value;

  }


  function unary() {

    if (expression[position] === "+") {

      position++;

      return unary();

    }


    if (expression[position] === "-") {

      position++;

      return -unary();

    }


    return primary();

  }


  function primary() {

    if (expression[position] === "(") {

      position++;

      const value =
        expressionPart();

      if (
        expression[position] !== ")"
      ) {

        throw new Error(
          "括弧が正しくありません"
        );

      }

      position++;

      return value;

    }


    const match =
      expression
        .slice(position)
        .match(
          /^(?:\d+(?:\.\d*)?|\.\d+)/
        );


    if (!match) {

      throw new Error(
        "計算式が正しくありません"
      );

    }


    position += match[0].length;

    return Number(match[0]);

  }


  const result =
    expressionPart();


  if (position !== expression.length)
    throw new Error(
      "計算式が正しくありません"
    );


  if (!Number.isFinite(result))
    throw new Error(
      "計算できません"
    );


  return result;

}


// ================================
// 色変換
// ================================

function colorTool() {

  app.innerHTML = `

    <div class="card">

      <h1>🎨 HEX / RGB変換</h1>

      <label>HEX</label>

      <div class="row">

        <input
          id="hex"
          value="#3b82f6"
        >

        <button
          class="action"
          id="hexConvert"
        >
          変換
        </button>

      </div>


      <label>RGB</label>

      <div class="row">

        <input
          id="rgb"
          placeholder="59, 130, 246"
        >

        <button
          class="action"
          id="rgbConvert"
        >
          変換
        </button>

      </div>


      <div
        class="color-preview"
        id="colorPreview"
      ></div>


      <div
        class="output"
        id="colorOutput"
      ></div>

    </div>

  `;


  const hex =
    document.getElementById("hex");

  const rgb =
    document.getElementById("rgb");

  const preview =
    document.getElementById("colorPreview");

  const output =
    document.getElementById("colorOutput");


  document
    .getElementById("hexConvert")
    .onclick = () => {

      let value =
        hex.value
          .trim()
          .replace("#", "");


      if (value.length === 3) {

        value =
          value
            .split("")
            .map(x => x + x)
            .join("");

      }


      if (!/^[0-9a-fA-F]{6}$/.test(value)) {

        output.textContent =
          "HEXが正しくありません";

        return;

      }


      const r =
        parseInt(value.slice(0, 2), 16);

      const g =
        parseInt(value.slice(2, 4), 16);

      const b =
        parseInt(value.slice(4, 6), 16);


      rgb.value =
        `${r}, ${g}, ${b}`;

      preview.style.background =
        "#" + value;

      output.textContent =
        `#${value.toUpperCase()}
→ rgb(${r}, ${g}, ${b})`;

    };


  document
    .getElementById("rgbConvert")
    .onclick = () => {

      const numbers =
        rgb.value.match(/\d+/g);


      if (
        !numbers ||
        numbers.length < 3 ||
        numbers.slice(0, 3)
          .some(x => Number(x) > 255)
      ) {

        output.textContent =
          "RGBが正しくありません";

        return;

      }


      const r = Number(numbers[0]);
      const g = Number(numbers[1]);
      const b = Number(numbers[2]);


      const value =
        [r, g, b]
          .map(
            x =>
              x.toString(16)
                .padStart(2, "0")
          )
          .join("");


      hex.value =
        "#" + value;

      preview.style.background =
        "#" + value;

      output.textContent =
        `rgb(${r}, ${g}, ${b})
→ #${value.toUpperCase()}`;

    };


  document
    .getElementById("hexConvert")
    .click();

}


// ================================
// URL
// ================================

function urlTool() {

  app.innerHTML = `

    <div class="card">

      <h1>🔗 URL変換</h1>

      <textarea
        id="urlInput"
        placeholder="URLや文字列を入力"
      ></textarea>

      <div class="row">

        <button
          class="action"
          id="urlEncode"
        >
          エンコード
        </button>

        <button
          class="action"
          id="urlDecode"
        >
          デコード
        </button>

        <button
          class="action"
          id="urlCopy"
        >
          コピー
        </button>

      </div>

      <textarea
        id="urlOutput"
        readonly
      ></textarea>

    </div>

  `;


  const input =
    document.getElementById("urlInput");

  const output =
    document.getElementById("urlOutput");


  document
    .getElementById("urlEncode")
    .onclick = () => {

      output.value =
        encodeURIComponent(input.value);

    };


  document
    .getElementById("urlDecode")
    .onclick = () => {

      try {

        output.value =
          decodeURIComponent(input.value);

      }

      catch {

        output.value =
          "デコードできません";

      }

    };


  document
    .getElementById("urlCopy")
    .onclick = () =>
      copyText(output.value);

}


// ================================
// JSON
// ================================

function jsonTool() {

  app.innerHTML = `

    <div class="card">

      <h1>📋 JSON整形</h1>

      <textarea
        id="jsonInput"
        placeholder='{"name":"Taro","age":15}'
      ></textarea>

      <div class="row">

        <button
          class="action"
          id="jsonPretty"
        >
          整形
        </button>

        <button
          class="action"
          id="jsonMinify"
        >
          圧縮
        </button>

        <button
          class="action"
          id="jsonCopy"
        >
          コピー
        </button>

      </div>

      <textarea
        id="jsonOutput"
        readonly
      ></textarea>

    </div>

  `;


  const input =
    document.getElementById("jsonInput");

  const output =
    document.getElementById("jsonOutput");


  function convert(space) {

    try {

      const object =
        JSON.parse(input.value);

      output.value =
        JSON.stringify(
          object,
          null,
          space
        );

    }

    catch (error) {

      output.value =
        "JSONエラー："
        + error.message;

    }

  }


  document
    .getElementById("jsonPretty")
    .onclick = () =>
      convert(2);


  document
    .getElementById("jsonMinify")
    .onclick = () =>
      convert(0);


  document
    .getElementById("jsonCopy")
    .onclick = () =>
      copyText(output.value);

}


// ================================
// UUID
// ================================

function uuidTool() {

  app.innerHTML = `

    <div class="card">

      <h1>🆔 UUID生成</h1>

      <div
        class="output"
        id="uuidOutput"
      ></div>

      <button
        class="action"
        id="generateUUID"
      >
        🔄 生成
      </button>

      <button
        class="action"
        id="copyUUID"
      >
        📋 コピー
      </button>

    </div>

  `;


  const output =
    document.getElementById("uuidOutput");


  function generate() {

    output.textContent =
      crypto.randomUUID();

  }


  document
    .getElementById("generateUUID")
    .onclick = generate;


  document
    .getElementById("copyUUID")
    .onclick = () =>
      copyText(output.textContent);


  generate();

}


// ================================
// タイマー
// ================================

function timerTool() {

  app.innerHTML = `

    <div class="card">

      <h1>⏱️ タイマー</h1>

      <div class="row">

        <input
          id="minutes"
          type="number"
          min="0"
          value="1"
          placeholder="分"
        >

        <input
          id="seconds"
          type="number"
          min="0"
          max="59"
          value="0"
          placeholder="秒"
        >

      </div>


      <div
        class="big"
        id="timerDisplay"
      >
        01:00
      </div>


      <div class="row">

        <button
          class="action"
          id="timerStart"
        >
          ▶ 開始
        </button>

        <button
          class="action"
          id="timerPause"
        >
          ⏸ 一時停止
        </button>

        <button
          class="action"
          id="timerReset"
        >
          🔄 リセット
        </button>

      </div>

    </div>

  `;


  let remaining = 60;
  let interval = null;


  const display =
    document.getElementById(
      "timerDisplay"
    );


  function draw() {

    const minutes =
      Math.floor(remaining / 60);

    const seconds =
      remaining % 60;


    display.textContent =
      String(minutes).padStart(2, "0")
      + ":"
      + String(seconds).padStart(2, "0");

  }


  function setFromInput() {

    remaining =
      (
        Number(
          document.getElementById("minutes").value
        ) || 0
      ) * 60
      +
      (
        Number(
          document.getElementById("seconds").value
        ) || 0
      );

    draw();

  }


  document
    .getElementById("timerStart")
    .onclick = () => {

      if (interval !== null)
        return;


      interval =
        setInterval(() => {

          remaining--;

          draw();


          if (remaining <= 0) {

            clearInterval(interval);

            interval = null;

            remaining = 0;

            draw();

            alert("タイマー終了！");

          }

        }, 1000);

    };


  document
    .getElementById("timerPause")
    .onclick = () => {

      clearInterval(interval);

      interval = null;

    };


  document
    .getElementById("timerReset")
    .onclick = () => {

      clearInterval(interval);

      interval = null;

      setFromInput();

    };


  document
    .getElementById("minutes")
    .onchange = setFromInput;

  document
    .getElementById("seconds")
    .onchange = setFromInput;


  draw();

}


// ================================
// TXTファイル
// ================================

function textfileTool() {

  app.innerHTML = `

    <div class="card">

      <h1>📄 TXTファイル作成</h1>

      <label>ファイル名</label>

      <input
        id="fileName"
        value="memo.txt"
      >

      <label>本文</label>

      <textarea
        id="fileText"
        placeholder="ここに文章を書いてください"
      ></textarea>

      <button
        class="action"
        id="downloadText"
      >
        💾 TXTをダウンロード
      </button>

    </div>

  `;


  document
    .getElementById("downloadText")
    .onclick = () => {

      let filename =
        document
          .getElementById("fileName")
          .value
          .trim();


      if (!filename)
        filename = "memo.txt";


      if (
        !filename
          .toLowerCase()
          .endsWith(".txt")
      ) {

        filename += ".txt";

      }


      const text =
        document
          .getElementById("fileText")
          .value;


      const blob =
        new Blob(
          [text],
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
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

    };

}


// ================================
// ツール切り替え
// ================================

function loadTool(tool) {

  switch (tool) {

    case "home":
      home();
      break;

    case "password":
      passwordTool();
      break;

    case "counter":
      counterTool();
      break;

    case "calculator":
      calculatorTool();
      break;

    case "color":
      colorTool();
      break;

    case "url":
      urlTool();
      break;

    case "json":
      jsonTool();
      break;

    case "uuid":
      uuidTool();
      break;

    case "timer":
      timerTool();
      break;

    case "textfile":
      textfileTool();
      break;

    default:
      home();

  }

}


// 最初にホームを表示
loadTool("home");
