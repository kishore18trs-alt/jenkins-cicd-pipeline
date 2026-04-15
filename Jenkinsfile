pipeline {
    agent any

    options {
        skipDefaultCheckout()
    }

    tools {
        nodejs 'NodeJS-20'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kishore18trs-alt/jenkins-cicd-pipeline.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
    steps {
        sh '''
            npm install -g pm2

            pm2 stop node-app || true
            pm2 delete node-app || true

            pm2 start index.js --name node-app

            sleep 5

            pm2 logs node-app --lines 20

            for i in {1..5}; do
              curl -f http://localhost:3000 && break
              echo "Retrying..."
              sleep 3
            done
        '''
    }
}

        stage('Notify') {
            steps {
                echo "Pipeline completed successfully 🎉"
            }
        }
    }

    post {
        success {
            mail to: 'kishore18.trs@gmail.com',
                 subject: "SUCCESS: ${env.JOB_NAME}",
                 body: "Build passed ✅ ${env.BUILD_URL}"
        }
        failure {
            mail to: 'kishore18.trs@gmail.com',
                 subject: "FAILED: ${env.JOB_NAME}",
                 body: "Build failed ❌ ${env.BUILD_URL}"
        }
    }
}