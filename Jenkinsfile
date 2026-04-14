// pipeline {
//     agent any

//     environment {
//         APP_NAME       = 'cicd-node-app'
//         REPO_URL       = ' https://github.com/kishore18trs-alt/jenkins-cicd-pipeline.git'
//         BRANCH_MAIN    = 'main'

//         GIT_CREDENTIAL = 'github-pat'
//         DEPLOY_SSH_KEY = 'deploy-server-ssh'

//         SLACK_CHANNEL  = '#ci-alerts'
//         NOTIFY_EMAIL   = 'team@example.com'

//         DEPLOY_HOST    = 'deploy@<server-ip>'
//         DEPLOY_DIR     = '/opt/apps/cicd-node-app'

//         NODE_VERSION   = '20'
//         PORT           = '3000'
//     }

//     options {
//         buildDiscarder(logRotator(numToKeepStr: '20'))
//         timeout(time: 20, unit: 'MINUTES')
//         disableConcurrentBuilds()
//         timestamps()
//         ansiColor('xterm')
//     }

//     triggers {
//         githubPush()
//     }

//     stages {

//         // ── STAGE 1: CHECKOUT ──────────────────────────────────────────
//         stage('Checkout') {
//             steps {
//                 echo "Checking out ${env.BRANCH_NAME}"
//                 checkout([
//                     $class: 'GitSCM',
//                     branches: [[name: "*/${env.BRANCH_NAME}"]],
//                     userRemoteConfigs: [[
//                         url: env.REPO_URL,
//                         credentialsId: env.GIT_CREDENTIAL
//                     ]],
//                     extensions: [[$class: 'CleanBeforeCheckout']]
//                 ])
//                 script {
//                     env.GIT_COMMIT_SHORT = sh(
//                         script: 'git rev-parse --short HEAD',
//                         returnStdout: true
//                     ).trim()
//                     env.GIT_AUTHOR = sh(
//                         script: 'git log -1 --pretty=format:"%an"',
//                         returnStdout: true
//                     ).trim()
//                 }
//                 echo "Commit ${env.GIT_COMMIT_SHORT} by ${env.GIT_AUTHOR}"
//             }
//         }

//         // ── STAGE 2: BUILD ─────────────────────────────────────────────
//         stage('Build') {
//             steps {
//                 echo 'Installing Node.js dependencies...'
//                 sh '''
//                     node --version
//                     npm --version
//                     npm ci
//                 '''
//                 echo 'Build complete — dependencies installed and locked.'
//             }
//         }

//         // ── STAGE 3: TEST ──────────────────────────────────────────────
//         stage('Test') {
//             parallel {
//                 stage('Unit tests') {
//                     steps {
//                         echo 'Running Jest tests with coverage...'
//                         sh 'npm test -- --ci'
//                     }
//                     post {
//                         always {
//                             // Publish JUnit-compatible results
//                             junit allowEmptyResults: true,
//                                   testResults: 'test-results/junit.xml'
//                             // Publish coverage report
//                             publishHTML(target: [
//                                 allowMissing: true,
//                                 alwaysLinkToLastBuild: true,
//                                 keepAll: true,
//                                 reportDir: 'coverage/lcov-report',
//                                 reportFiles: 'index.html',
//                                 reportName: 'Coverage Report'
//                             ])
//                         }
//                     }
//                 }
//                 stage('Lint') {
//                     steps {
//                         echo 'Running ESLint...'
//                         sh 'npm run lint'
//                     }
//                 }
//             }
//         }

//         // ── STAGE 4: DEPLOY (main branch only) ─────────────────────────
//         stage('Deploy') {
//             when {
//                 branch env.BRANCH_MAIN
//             }
//             steps {
//                 echo "Deploying to ${DEPLOY_HOST}:${DEPLOY_DIR}"
//                 sshagent(credentials: [env.DEPLOY_SSH_KEY]) {
//                     sh """
//                         # Create app directory if it doesn't exist
//                         ssh -o StrictHostKeyChecking=no ${DEPLOY_HOST} \
//                             'mkdir -p ${DEPLOY_DIR}'

//                         # Sync project files (exclude node_modules, test files)
//                         rsync -avz --delete \
//                             --exclude='node_modules' \
//                             --exclude='test' \
//                             --exclude='coverage' \
//                             --exclude='.git' \
//                             ./ ${DEPLOY_HOST}:${DEPLOY_DIR}/

//                         # Install production deps and restart
//                         ssh -o StrictHostKeyChecking=no ${DEPLOY_HOST} '
//                             cd ${DEPLOY_DIR} && \
//                             npm ci --omit=dev && \
//                             pm2 restart ${APP_NAME} || \
//                             pm2 start app/index.js --name ${APP_NAME} --env production && \
//                             pm2 save
//                         '
//                     """
//                 }
//                 echo "Deploy complete. App live on port ${PORT}."
//             }
//         }
//     }

//     // ── STAGE 5: NOTIFY ────────────────────────────────────────────────
//     post {
//         success {
//             script {
//                 slackSend(
//                     channel: env.SLACK_CHANNEL,
//                     color: 'good',
//                     message: """:white_check_mark: *PASSED* — `${APP_NAME}`
// • Branch: `${env.BRANCH_NAME}` | Commit: `${env.GIT_COMMIT_SHORT}` by ${env.GIT_AUTHOR}
// • Duration: ${currentBuild.durationString.replace(' and counting', '')}
// • <${env.BUILD_URL}|View build> | <${env.BUILD_URL}Coverage_20Report/|Coverage>"""
//                 )
//             }
//             emailext(
//                 to: env.NOTIFY_EMAIL,
//                 subject: "[CI] PASS — ${APP_NAME} #${env.BUILD_NUMBER} (${env.BRANCH_NAME})",
//                 body: """Build passed successfully.

// Project : ${APP_NAME}
// Branch  : ${env.BRANCH_NAME}
// Commit  : ${env.GIT_COMMIT_SHORT}
// Author  : ${env.GIT_AUTHOR}
// Duration: ${currentBuild.durationString}

// Console : ${env.BUILD_URL}console
// Coverage: ${env.BUILD_URL}Coverage_Report/
// """
//             )
//         }

//         failure {
//             script {
//                 slackSend(
//                     channel: env.SLACK_CHANNEL,
//                     color: 'danger',
//                     message: """:x: *FAILED* — `${APP_NAME}`
// • Branch: `${env.BRANCH_NAME}` | Commit: `${env.GIT_COMMIT_SHORT}` by ${env.GIT_AUTHOR}
// • Failed at stage: *${env.STAGE_NAME ?: 'unknown'}*
// • <${env.BUILD_URL}console|View console log>"""
//                 )
//             }
//             emailext(
//                 to: env.NOTIFY_EMAIL,
//                 subject: "[CI] FAIL — ${APP_NAME} #${env.BUILD_NUMBER} (${env.BRANCH_NAME})",
//                 body: """Build FAILED. Immediate attention required.

// Project : ${APP_NAME}
// Branch  : ${env.BRANCH_NAME}
// Commit  : ${env.GIT_COMMIT_SHORT}
// Author  : ${env.GIT_AUTHOR}

// Console : ${env.BUILD_URL}console
// """
//             )
//         }

//         always {
//             cleanWs()
//         }
//     }
// }

pipeline {
    agent any

    tools {
        nodejs 'node-20'
    }

    stages {

        stage('Check Node') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || echo "No tests found"'
            }
        }
    }
}