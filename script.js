document.addEventListener('DOMContentLoaded', () => {
    const backgroundColorInput = document.getElementById('backgroundColor');
    const heightInput = document.getElementById('height');
    const widthInput = document.getElementById('width');
    const borderRadiusInput = document.getElementById('borderRadius');
    const neumorphismTypeInput = document.getElementById('neumorphismType');
    const shadowDistanceInput = document.getElementById('shadowDistance');
    const shadowStrengthInput = document.getElementById('shadowStrength');
    const shadowBlurInput = document.getElementById('shadowBlur');
    const previewBox = document.getElementById('previewBox');
    const cssOutput = document.getElementById('cssOutput');
    const copyButton = document.getElementById('copyButton');
    const typeButtons = document.querySelectorAll('.type-button');

    function generateNeumorphismCSS() {
        const backgroundColor = backgroundColorInput.value;
        const height = heightInput.value + 'px';
        const width = widthInput.value + 'px';
        const borderRadius = borderRadiusInput.value + 'px';
        const neumorphismType = neumorphismTypeInput.value;
        const shadowDistance = parseInt(shadowDistanceInput.value);
        const shadowStrength = parseInt(shadowStrengthInput.value);
        const shadowBlur = parseInt(shadowBlurInput.value);

        const lightShadowColor = adjustShadowColor(backgroundColor, 'light', 0.15);
        const darkShadowColor = adjustShadowColor(backgroundColor, 'dark', 0.15);

        let boxShadow = '';
        let backgroundImage = 'none';

        if (neumorphismType === 'convex') {
    boxShadow = `${shadowDistance}px ${shadowDistance}px ${shadowBlur}px ${shadowStrength}px ${darkShadowColor}, ` +
                `-${shadowDistance}px -${shadowDistance}px ${shadowBlur}px ${shadowStrength}px ${lightShadowColor}`;
} else if (neumorphismType === 'depressed') {
    boxShadow = `inset ${shadowDistance}px ${shadowDistance}px ${shadowBlur}px ${shadowStrength}px ${darkShadowColor}, ` +
                `inset -${shadowDistance}px -${shadowDistance}px ${shadowBlur}px ${shadowStrength}px ${lightShadowColor}`;
} else if (neumorphismType === 'flat') {
    const halfDistance = shadowDistance / 2;
    const halfBlur = shadowBlur / 2;
    const halfStrength = shadowStrength / 2;
    boxShadow = `${halfDistance}px ${halfDistance}px ${halfBlur}px ${halfStrength}px ${darkShadowColor}, ` +
                `-${halfDistance}px -${halfDistance}px ${halfBlur}px ${halfStrength}px ${lightShadowColor}`;
} else if (neumorphismType === 'none') {
    boxShadow = 'none';
}


        previewBox.style.backgroundColor = backgroundColor;
        previewBox.style.height = height;
        previewBox.style.width = width;
        previewBox.style.borderRadius = borderRadius;
        previewBox.style.boxShadow = boxShadow;
        previewBox.style.backgroundImage = backgroundImage;

        const css = `
.neumorphism-element {
    background-color: ${backgroundColor};
    width: ${width};
    height: ${height};
    border-radius: ${borderRadius};
    box-shadow: ${boxShadow};
}
`;
        cssOutput.value = css.trim();
    }

    function adjustShadowColor(bgColor, type, amount = 0.1) {
        const color = hexToRgb(bgColor);
        if (!color) return type === 'light' ? '#ffffff' : '#000000';

        let r = color.r;
        let g = color.g;
        let b = color.b;

        if (type === 'light') {
            r = Math.min(255, r + 255 * amount);
            g = Math.min(255, g + 255 * amount);
            b = Math.min(255, b + 255 * amount);
        } else {
            r = Math.max(0, r - 255 * amount);
            g = Math.max(0, g - 255 * amount);
            b = Math.max(0, b - 255 * amount);
        }

        return rgbToHex(`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
    }

    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(rgb) {
        const values = rgb.substring(rgb.indexOf('(') + 1, rgb.indexOf(')')).split(',').map(Number);
        return "#" + ((1 << 24) + (values[0] << 16) + (values[1] << 8) + values[2]).toString(16).slice(1);
    }

    function updateBackgroundColor() {
        document.body.style.backgroundColor = backgroundColorInput.value;
        const container = document.querySelector('.generator-container');
        if (container) {
            container.style.backgroundColor = backgroundColorInput.value;
            container.style.boxShadow = `15px 15px 30px ${darkenColor(backgroundColorInput.value, 0.1)}, -15px -15px 30px ${lightenColor(backgroundColorInput.value, 0.1)}`;
            const controlsPanel = document.querySelector('.controls-container');
            if (controlsPanel) {
                controlsPanel.style.backgroundColor = lightenColor(backgroundColorInput.value, 0.05);
                controlsPanel.style.borderLeftColor = darkenColor(backgroundColorInput.value, 0.05);
            }
        }
        generateNeumorphismCSS();
    }

    function lightenColor(hex, amount) {
        const color = hexToRgb(hex);
        if (!color) return hex;
        const r = Math.min(255, color.r + 255 * amount);
        const g = Math.min(255, color.g + 255 * amount);
        const b = Math.min(255, color.b + 255 * amount);
        return rgbToHex(`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
    }

    function darkenColor(hex, amount) {
        const color = hexToRgb(hex);
        if (!color) return hex;
        const r = Math.max(0, color.r - 255 * amount);
        const g = Math.max(0, color.g - 255 * amount);
        const b = Math.max(0, color.b - 255 * amount);
        return rgbToHex(`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
    }

    function handleTypeButtonClick(event) {
        document.querySelector('.type-button.active').classList.remove('active');
        this.classList.add('active');
        neumorphismTypeInput.value = this.dataset.type;
        generateNeumorphismCSS();
    }

    backgroundColorInput.addEventListener('input', updateBackgroundColor);
    heightInput.addEventListener('input', generateNeumorphismCSS);
    widthInput.addEventListener('input', generateNeumorphismCSS);
    borderRadiusInput.addEventListener('input', generateNeumorphismCSS);
    shadowDistanceInput.addEventListener('input', generateNeumorphismCSS);
    shadowStrengthInput.addEventListener('input', generateNeumorphismCSS);
    shadowBlurInput.addEventListener('input', generateNeumorphismCSS);

    typeButtons.forEach(button => {
        button.addEventListener('click', handleTypeButtonClick);
    });

    copyButton.addEventListener('click', () => {
        cssOutput.select();
        document.execCommand('copy');
        alert('CSS copied to clipboard!');
    });

    generateNeumorphismCSS(); // 初期表示
    updateBackgroundColor(); // 初期背景色を設定
});

// 明るさを判定する関数（YIQ式）
function isColorDark(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}

// テーマを切り替える関数
function updateTextColorTheme(bgColor) {
    const controls = document.getElementById('controlsContainer');
    const isDark = isColorDark(bgColor);
    controls.classList.toggle('dark-theme', isDark);
}

const backgroundColorInput = document.getElementById('backgroundColor');
const previewBox = document.getElementById('previewBox');

backgroundColorInput.addEventListener('input', function () {
    const bgColor = backgroundColorInput.value;
    document.body.style.backgroundColor = bgColor;
    previewBox.style.backgroundColor = bgColor;
    updateTextColorTheme(bgColor); // ← テーマ切り替え
    updateBoxStyle(); // 既存の関数
});
