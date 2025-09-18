import React from "react";
import "./key-button.css";

type KeyButtonProps = {
  label?: React.ReactNode;      // Conteúdo dentro do botão (texto, imagem, etc.)
  onClick?: () => void;         // Função chamada ao clicar
  ariaLabel?: string;           // Texto para acessibilidade
  sizeWidth?: number; 
  sizeHeight?: number;
  paddingVar?: number;             // Tamanho do botão (largura e altura)
  outerRadius?: number;         // Borda arredondada externa
  innerRadius?: number;         // Borda arredondada interna
  fontSize?: number;
  fontWeight?: number;            // Peso da fonte do texto
  outerGradient?: string;       // Gradiente do container externo
  innerGradient?: string;       // Gradiente do container interno
  shadow?: string;              // Sombra do botão
  textColor?: string;           // Cor do texto
};

export default function KeyButton({
  label = "1" as React.ReactNode,
  onClick,
  ariaLabel,
  sizeWidth = 70,
  sizeHeight = 70,
  paddingVar = 4,
  outerRadius = 24,
  innerRadius = 20,
  fontSize = 40,
  fontWeight = 400,
  outerGradient = "linear-gradient(150deg, #333333 30%, #636363 100%)",
  innerGradient = "linear-gradient(290deg, #333333 30%, #636363 100%)",
  shadow = "0px 2px 4px 2px rgba(0,0,0,0.30)",
  textColor = "#fff",
}: KeyButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel ?? `Tecla ${label}`}
      style={{
        width: sizeWidth,
        height: sizeHeight,
        padding: paddingVar,
        border: "none",
        borderRadius: outerRadius,
        background: outerGradient,
        boxShadow: shadow,
        cursor: "pointer",
        outline: "none",
        display: "inline-flex",
      }}
    >
      <div
        className="key-button-text"
        style={{
          '--font-weight': fontWeight,
          flex: 1,
          borderRadius: innerRadius,
          background: innerGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: textColor,
          fontSize: fontSize,
          lineHeight: 1,
          fontWeight: fontWeight || 400,
          fontFamily:
            `Poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans"`,
          textShadow: "0 2px 8px rgba(0,0,0,0.35), 0 1px 0 #000"
        } as React.CSSProperties}
      >
        {label}
      </div>
    </button>
  );
}
