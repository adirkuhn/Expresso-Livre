<?php
ini_set('display_errors', 1);

if (!isset($_SERVER['HTTP_HOST'])) {
    exit('Este arquivo não pode ser rodado no modo texto.');
}

// if (!in_array(@$_SERVER['REMOTE_ADDR'], array(
//     '127.0.0.1',
//     '::1',
// ))) {
//     header('HTTP/1.0 403 Forbidden');
//     exit('This script is only accessible from localhost.');
// }

require_once dirname(__FILE__).'/../app/ExpressoRequirements.php';

$expressoRequirements = new ExpressoRequirements();

$majorProblems = $expressoRequirements->getFailedRequirements();
$minorProblems = $expressoRequirements->getFailedRecommendations();

?>
<!DOCTYPE html>
<html lang="pt_BR">
    <head>
        <meta charset="UTF-8" />
        <title>Configurador do Expresso</title>
    </head>
    <body>
        <div id="symfony-wrapper">
            <div id="symfony-content">
                <div class="symfony-blocks-install">
                    <div class="symfony-block-logo">
                        <img src="http://upload.wikimedia.org/wikipedia/commons/2/27/ExpressoLivreLogo.png" alt="Expresso logo" />
                    </div>

                    <div class="symfony-block-content">
                        <h1>Expresso Livre 3.0</h1>
                        <p>Verificação do ambiente.</p>
                        <p>
                            Esta página irá ajudar você a fazer a configuração básica do Expresso.
                            Você pode fazer essas alterações diremamente no arquivo ‘<strong>app/config/parameters.yml</strong>’.
                        </p>

                        <?php if (count($majorProblems)): ?>
                            <h2>Problemas do ambiente</h2>
                            <p>Os seguintes problemas detectados <strong>devem ser</strong> corrigidos antes de continuar:</p>
                            <ol>
                                <?php foreach ($majorProblems as $problem): ?>
                                    <li><?php echo $problem->getHelpHtml() ?></li>
                                <?php endforeach; ?>
                            </ol>
                        <?php endif; ?>

                        <?php if (count($minorProblems)): ?>
                            <h2>Recomendações</h2>
                            <p>
                                Para o melhor funcionamento do Expresso
                                é recomendado corrigir os seguintes items:
                            </p>
                            <ol>
                                <?php foreach ($minorProblems as $problem): ?>
                                    <li><?php echo $problem->getHelpHtml() ?></li>
                                <?php endforeach; ?>
                            </ol>
                        <?php endif; ?>

                        <?php if ($expressoRequirements->hasPhpIniConfigIssue()): ?>
                            <p id="phpini">*
                                <?php if ($expressoRequirements->getPhpIniConfigPath()): ?>
                                    Alterações no <strong>php.ini</strong> devem ser feitas no caminho "<strong><?php echo $expressoRequirements->getPhpIniConfigPath() ?></strong>".
                                <?php else: ?>
                                    Para alterar as configurações crie um arquivo "<strong>php.ini</strong>".
                                <?php endif; ?>
                            </p>
                        <?php endif; ?>

                        <ul class="symfony-install-continue">
                            <?php if (!count($majorProblems)): ?>
                                <li><a href="app_dev.php/setup/">Ir para página de configuração</a></li>
                            <?php endif; ?>
                            <li><a href="configExpresso.php">Re-verificar requisitos</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="version">Expresso 3.0</div>
    </body>
</html>
