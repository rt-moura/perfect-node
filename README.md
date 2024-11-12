# Perfect-Node

![Perfect-Node ScreenShot](proof-of-concept.gif)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Um emulador dos servidores oficiais de Perfect World v1.2.6 escrito em TypeScript (NodeJS)
> Perfect World é um MMORPG de aventura e fantasia em 3D com cenários tradicionais chineses, desenvolvido em 2005 pela chinesa Beijing Perfect World e lançado no Brasil em 2008 pela Level Up Games.

## Rede
- O tráfego de rede para a troca de pacotes entre servidor e cliente em sua maior parte é comprimido e criptografado, usando os algoritmos MPPC (Microsoft-Point-to-Point-Compression) e RC4 (cifra simétrica) respectivamente.
- O servidor comprime e cifra os dados enviados para o cliente, que faz o processo reverso para processa-los, e este apenas cifra os dados que são enviados ao servidor, sem compressão.
- A chave RC4 é calculada apartir de um HMACMD5 que tem como chave o *login* do usuário e como mensagem parametros como: *passwordHash*, *serverKey* e *clientKey*.

## Dependências
- NodeJS
- TypeScript

## Instalação
> Assumindo que você já tenha o NodeJS instalado no seu computador.
```bash
git clone https://github.com/rt-moura/perfect-node.git
cd perfect-node
npm install
```

## Uso
Para executar o servidor basta executar o comando ```npm start``` na pasta raiz do projeto.

É necessário obter uma cópia do jogo através da internet, você irá precisar da versão 1.2.6 v7.
Após conseguir uma cópia entre na pasta raiz do jogo e siga o caminho: element/userdata/server e edite o arquivo serverlist.txt com o seu endereço IP local. Com o servidor funcionando o cliente configurado basta abrir o executável do jogo.

## Estado de desenvolvimento
A infraestrutura de rede do servidor está completa. Foram implementados alguns pacotes e seus respectivos *handlers*, o que nos permite, no momento, ir até a criação de personagens. Para outras funcionalidades mais pacotes precisam ser implementados.
