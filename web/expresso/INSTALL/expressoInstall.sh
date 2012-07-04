#!/bin/bash
#
# set tabstop=5
#
# Criado por William Fernando Merlotto <william@prognus.com.br>
# Baseado no script original desenvolvido por João Alfredo Knopik Junior <jakjr@celepar.pr.gov.br>
# com colaborações de:
#	"William Fernando Merlotto" <william@prognus.com.br>, para Debian, Ubuntu, Red Hat e CentOS
#	"Gustavo Nakahara" <gustavonk@prognus.com.br>, para Debian, Ubuntu, Red Hat e CentOS
#	"Rafael Cristaldo" <rafael@prognus.com.br>, para Debian, Ubuntu, Red Hat e CentOS
#	"Alexandre Felipe Muller de Souza" <amuller@celepar.pr.gov.br>, para Debian
#	"Cássio Luiz" <cassiolp@cnpq.br>, para Red Hat e CentOS
# 	"M. Rodrigo Monteiro" <mrodrigom@gmail.com>, para Red Hat e CentOS
#
#
# Versões:
# 27/03/2012 - v1.0
# 	Termino do instalador basico, para Debian Squeeze, CentOS 6 e Ubuntu Server 11.10

#################################################################################################
#												#
#						MAIN						#
#												#
#################################################################################################

# TODO: Internacionalizar o script de instalação:
# http://www.linuxquestions.org/questions/programming-9/bash-script-how-to-get-locale-translations-802726/
# http://tldp.org/LDP/abs/html/localization.html
# http://mywiki.wooledge.org/BashFAQ/098

alias cp='cp -f'

# Variaveis globais
ARQS="arquivos"
VERSAO="2.4.0"
# Inclusao dos scripts de apoio
. $ARQS/scripts/aux.sh
. $ARQS/scripts/ini.sh
. $ARQS/scripts/http.sh
. $ARQS/scripts/ldap.sh
. $ARQS/scripts/bd.sh
. $ARQS/scripts/smtp.sh
. $ARQS/scripts/imap.sh

# Verifica o usuario que esta executando o script
# DEBUG: Comente esta linha para testar o script sem utilizar o usuário root.
[ $UID != 0 ] && { echo "Este script deve ser executado como superusuario (root) ou com sudo"; exit 1; }

# Identifica o SO
qualSO
# Verifica se o SO eh compativel com o instalador
if ( validaSO "Debian" "6.0" )
then
	INSTALL="debian_6"
elif ( validaSO "Ubuntu" "11.10" )
then
	INSTALL="ubuntu_1110"
elif ( validaSO "CentOS" "6." || validaSO "RedHat" "6." )
then
	INSTALL="rhel_6"
else
	echo "Sistema operacional desconhecido ou incompativel com o instalador do Expresso Livre!"
	echo "$OSSTR"
	echo "Por favor, utilize uma distribuição GNU/Linux compatível: Debian 6.x, Ubuntu 11.10 ou CentOS/RedHat 6.x"
	exit 1
fi

# Telas da instalacao
BACKTITLE="Instalação do ExpressoLivre versão $VERSAO"

BACKTITLE="$BACKTITLE, para $INSTALL"

# Inicializacao basica de instalacao, como atualização de repositório e criação de variáveis de ambiente
ini_$INSTALL

INTRO='
Bem-Vindo(a) a instalação do ExpressoLivre!

O script de instalação lhe permitirá escolher entre instalar e configurar automaticamente todos os serviços necessário ao funcionamento do ExpressoLivre ou lhe permitirá escolher quais serviços serão instalados e configurados. Esta última alternativa é interessante para ambientes grandes, onde os serviços são instalados e configurados em máquinas distintas.

As informações de senha, domínio e organização serão requisitadas de acordo com o(s) serviço(s) selecionado(s).

A equipe ExpressoLivre não se responsabiliza por danos ocasionados pelo uso deste instalador ou mesmo pelo próprio ExpressoLivre.
Você deseja prosseguir, por sua conta e risco, a instalação ExpressoLivre?'

# Se o usuario escolher "nao", será retornado 1 e consequentemente o script será encerrado.
dialog --backtitle "$BACKTITLE" --cr-wrap --yesno "$INTRO" 18 80 || exit 0

# Inicia a escolha/instalacao e configuracao dos servicos nessarios ao ExpressoLivre
SERVICOS=$( dialog --backtitle "$BACKTITLE" --stdout --separate-output \
	--checklist 'Por favor, selecione quais serviços serão instalados neste sistema operacional:' 14 75 14 \
	http 'Servidor http (apache) juntamente com os módulos do PHP5' on \
	ldap 'Servidor ldap (openldap)' on \
	bd 'Servidor de banco de dados (postgresql)' on \
	smtp 'Sevirdor smtp (postfix)' on \
	imap 'Servidor imap (cyrus-imap)' on )

# Executa funcao de instalacao/configuracao do servico no respectivo SO.
for I in $SERVICOS
do
	$I\_$INSTALL
done

dialog --backtitle "$BACKTITLE" --cr-wrap --msgbox "A comunidade do Expresso Livre agradece a sua participação.\n\n\nEm caso de dúvidas, por favor, visite: http://www.expressolivre.org" 8 75
