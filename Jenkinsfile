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
                    docker stop node-app || true
                    docker rm node-app || true
                    docker build -t node-app .
                    docker run -d -p 3000:3000 --name node-app node-app
                    sleep 3
                    curl -f http://localhost:3000
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