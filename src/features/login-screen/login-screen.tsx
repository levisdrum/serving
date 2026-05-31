import { Button } from "../../design-system/components/button/button";
import { AvatarField } from "../../design-system/components/avatar-field/avatar-field";
import { Select } from "../../design-system/components/select/select";
import { TextField } from "../../design-system/components/text-field/text-field";
import type { LoginScreenProps } from "./types";
import "./styles.css";

export function LoginScreen(props: LoginScreenProps) {
  const videoUrl = "https://video.wixstatic.com/video/285ce0_76771d41250741d5ae1673d998971ffa/1080p/mp4/file.mp4";

  if (props.authView === "home") {
    return (
      <main className="login-page">
        <video className="login-page__video" autoPlay loop muted playsInline aria-label="Vídeo de fundo da página de login">
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="login-page__overlay" />
        <section className="login-card login-card--home">
          <img
            className="login-card__logo"
            src={props.churchLogo}
            alt="Logo da Estação 337"
          />
          <h1>Bem-vindo ao Serving</h1>
          <p className="login-card__subtitle">Ferramenta de escalas da Estação 337</p>
          <div className="login-card__home-actions">
            <Button onPress={props.onShowLogin}>Login</Button>
            <Button tone="neutral" onPress={props.onShowSignup}>
              Novo cadastro
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="login-page">
      <video className="login-page__video" autoPlay loop muted playsInline aria-label="Vídeo de fundo da página de login">
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="login-page__overlay" />
      <section className="login-card">
        <div className="login-card__header">
          <img
            className="login-card__logo"
            src={props.churchLogo}
            alt="Logo da Estação 337"
          />
          {props.authView === "signup" ? <h1>Novo cadastro</h1> : null}
        </div>
        <p className="login-card__subtitle">
          {props.authView === "signup"
            ? "Crie seu perfil para participar das escalas da Estação 337."
            : "Use seu e-mail para acessar sua área de escala."}
        </p>
        {props.authView === "signup" ? (
          <>
            <TextField
              label="Nome"
              value={props.signupName}
              onChange={props.onSignupNameChange}
              placeholder="Seu nome"
            />
            <TextField
              label="Email"
              value={props.signupEmail}
              onChange={props.onSignupEmailChange}
              type="email"
              placeholder="seuemail@337"
            />
            <Select
              label="Qual congregação"
              selectedKey={props.signupCongregacao}
              onSelectionChange={(value) =>
                props.onSignupCongregacaoChange(
                  value as typeof props.signupCongregacao,
                )
              }
              options={[
                { id: "SP AM", label: "SP AM" },
                { id: "SP PM", label: "SP PM" },
                { id: "BH", label: "BH" },
                { id: "PF", label: "PF" },
              ]}
            />
            <AvatarField
              label="Avatar (opcional)"
              value={props.signupFotoUrl}
              onChange={props.onSignupFotoUrlChange}
            />
            <Select
              label="Função/ministério principal"
              selectedKey={props.signupMinisterioPrincipal}
              onSelectionChange={(value) =>
                props.onSignupMinisterioPrincipalChange(value as typeof props.signupMinisterioPrincipal)
              }
              options={[
                { id: "ministro-louvor", label: "Ministro de louvor" },
                { id: "vocalista", label: "Vocalista" },
                { id: "violao", label: "Violão" },
                { id: "guitarra", label: "Guitarra" },
                { id: "baixo", label: "Baixo" },
                { id: "bateria", label: "Bateria" },
                { id: "teclado", label: "Teclado" },
                { id: "mesa-som", label: "Mesa de som" },
                { id: "projecao", label: "Projeção" },
                { id: "transmissao", label: "Transmissão" },
                { id: "recepcao", label: "Recepção" },
                { id: "apoio", label: "Apoio" },
                { id: "intercessao", label: "Intercessão" },
                { id: "danca", label: "Dança" },
                { id: "outro", label: "Outro" },
              ]}
            />
            <TextField
              label="Senha"
              value={props.signupPassword}
              onChange={props.onSignupPasswordChange}
              type="password"
              placeholder="Crie sua senha"
            />
            {props.signupError ? (
              <p className="login-card__error">{props.signupError}</p>
            ) : null}
            <Button onPress={props.onSignup}>Criar usuário</Button>
          </>
        ) : (
          <>
            <TextField
              label="Email"
              value={props.identifier}
              onChange={props.onIdentifierChange}
              type="email"
              placeholder="Digite seu e-mail"
              name="email"
            />
            <TextField
              label="Senha"
              value={props.password}
              onChange={props.onPasswordChange}
              type="password"
              placeholder="Digite sua senha"
              name="password"
            />
            {props.loginError ? (
              <p className="login-card__error">{props.loginError}</p>
            ) : null}
            <Button onPress={props.onLogin}>Login</Button>
          </>
        )}
        <Button className="login-card__link" tone="neutral" onPress={props.onShowHome}>
          Voltar
        </Button>
      </section>
    </main>
  );
}
