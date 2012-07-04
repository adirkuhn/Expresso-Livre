
# Servico HTTP (APACHE)

# Parte comum da instalação da "aplicação" do Expresso para todos os SOs.
# Parametro 1: diretório destino para onde os arquivos do Expresso serão copiados.
cpexpresso ()
{
	# Faz a configuracao da nova API antes de copiar os arquivos
	config_api

	DIR_EXPRESSO="$1/expresso"
	# Copia o Expresso para o diretório indicado como parâmetro
	echo "Copiando arquivos do Expresso Livre..."
	cp -r "`dirname $PWD`" $DIR_EXPRESSO
	# Copia o mkntpwd para o home do Expresso
	mkdir -p /home/expressolivre
	cp $ARQS/home/expressolivre/* /home/expressolivre/
	
	# Requisita a senha
	get_pass
	HEADER_PWD=`php $ARQS/scripts/pass.php $LDAP_PWD`
	sed -e "s/HEADER_PWD/$HEADER_PWD/g" -e "s|EXPRESSO_DIR|$DIR_EXPRESSO|g" $ARQS/header.inc.php > $DIR_EXPRESSO/header.inc.php
	chmod 640 $DIR_EXPRESSO/header.inc.php
	
	# Requisita o domino para corrigir o hosts do servidor, utilizado pelo apache
	get_org
	# Faz backup do hosts
	cp -f /etc/hosts /etc/hosts.`date "+%s"`
	NOVOHOSTS=`mktemp`
	echo "127.0.0.1 $DOMAIN localhost `hostname`" > $NOVOHOSTS
	cat /etc/hosts >> $NOVOHOSTS
	mv -f $NOVOHOSTS /etc/hosts
	
	#Script para o CRON
	sed -e "s|EXPRESSO_DIR|$DIR_EXPRESSO|g" $ARQS/expresso-cron > /tmp/expresso-cron
}

# Configura os arquivos da nova API
config_api ()
{
	# Para pegar a organizacao e principalmente o LDAP_DN
	get_org
	# A principio so sera necessario configurar o LDAP
	ARQ_LDAP="../prototype/config/OpenLDAP.srv"
	mv $ARQ_LDAP "$ARQ_LDAP.orig"
	cat "$ARQ_LDAP.orig" | sed -e "s/LDAP_DN/$LDAP_DN/g" > $ARQ_LDAP
}

http_debian ()
{
	# Instala o apache2 juntamente com o PHP5 e seus respectivos módulos
	apt-get install -y apache2-mpm-prefork libapache2-mod-php5 apache2-utils \
		php5 php5-common php5-dev php5-gd php5-imap php5-ldap php5-pgsql php5-cgi php5-cli php5-curl php5-xmlrpc php5-memcache\
		zip unzip
	# Copia os arquivos do Expresso Livre
	cpexpresso "/var/www"
	chown -R www-data:www-data /var/www/expresso /home/expressolivre

	# descomente para gerar o certificado para o https
	#apache2-ssl-certificate;
	a2enmod rewrite
	a2enmod ssl

	# Ativa o script do CRON para o Debian e similares
	sed -e "s|#DEBIAN||g" /tmp/expresso-cron > /etc/cron.d/expresso
}

http_debian_6 ()
{
	http_debian
	# Copia a configuração do servidor apache2
	cp -a debian/squeeze/etc/apache2/apache2.conf /etc/apache2/
	cp -a debian/squeeze/etc/apache2/ports.conf /etc/apache2/
	cp -a debian/squeeze/etc/apache2/sites-available/expresso /etc/apache2/sites-available/
	cp -a debian/squeeze/etc/apache2/ssl/ /etc/apache2/

	a2ensite expresso
	a2dissite default

	# Copia a configuração do PHP
	#cp -a debian/squeeze/etc/php5/apache2/php.ini /etc/php5/apache2/
	/etc/init.d/cron restart
	/etc/init.d/apache2 restart
}

http_ubuntu_1110 ()
{
	http_debian_6
	cp -a ubuntu/11.10/.htaccess $DIR_EXPRESSO
        cp -a ubuntu/11.10/etc/apache2/apache2.conf /etc/apache2/
	/etc/init.d/cron restart
	/etc/init.d/apache2 restart
}

http_rhel ()
{
	yum -y install httpd mod_ssl \
		php php-cli php-ldap php-pgsql php-imap php-mbstring php-gd php-xml \
		memcached php-pecl-memcache libmemcached \
		unzip zip

	cpexpresso "/var/www/html"
	chown -R apache:apache /var/www/html/expresso /home/expressolivre

	chkconfig httpd on

	# Ativa o script do CRON para o RedHat e similares
	sed -e "s|#CENTOS||g" /tmp/expresso-cron > /etc/cron.d/expresso
}

http_rhel_6 ()
{
	http_rhel
	# Para pegar ou definir o DOMAIN
	get_org

	cp -a rhel/6/etc/httpd/conf/httpd.conf /etc/httpd/conf/
	sed -e "s/DOMAIN/$DOMAIN/g" rhel/6/etc/httpd/conf.d/expresso.conf > /etc/httpd/conf.d/expresso.conf
	cp -a rhel/6/etc/httpd/conf.d/ssl.conf /etc/httpd/conf.d/
	/etc/init.d/crond restart
	service httpd restart
}

