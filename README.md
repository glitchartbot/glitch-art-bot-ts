**_To read this documentation in english, [click here](./README-en-us.md)_**

# glitch-art-bot-ts

Bot do Twitter (@GlitchArtBot) que aplica efeitos de glitch art em imagens.

## Como funciona

O bot usa as credenciais dele, conecta na stream do Twitter e fica "ouvindo" quando algum usuário menciona o nome de usuário dele, então ele verifica se o tweet "pai" do qual ele foi mencionado tem uma imagem válida (arquivos classificados como `photo` pelo Twitter), se tiver, o bot baixa a imagem, cria um processo filho e executa um comando que aplica os efeitos na imagem, então responde o usuário que mencionou o bot com a imagem editada.

## Como usar

Tem um repositório só pra isso, olha que incrível! [Clique aqui](https://github.com/glitchartbot/glitch-art-bot-scripts) pra uma explicação detalhada de como usar e personalizar o bot! :)

## Scripts disponíveis

\*_Por mais que a maioria, (senão todos) os scripts não sejam de autoria minha, eles tiveram que ser ajustados pra funcionarem corretamente com o bot. Pra ver os scripts usados pelo bot e como usá-los, [clique aqui](https://github.com/glitchartbot/glitch-art-bot-scripts)._

- Pixel Sort por [Kim Asendorf](https://github.com/kimasendorf)
- Pixel Drift por [João Friaça](https://github.com/friaca)
