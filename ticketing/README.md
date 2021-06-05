Secrets managed by Kubernetes
 - jwt-secret
 - kubectl create secret generic jwt-secret --from-literal=JWT_KEY=[your secret goes here]

Get Started Ticketing

  - Install kubernetes (you can do it easily via docker descktop )   
  - Set env variables in cluster
    kubectl create secret generic jwt-secret --from-literal=JWT_KEY=[your secret goes here]

  - Install ingress nginx (Check the deployment guide https://kubernetes.github.io/ingress-nginx)
  - Go to /etc/hosts and add
      127.0.0.1 ticketing.dev
  - install skaffold
     brew install skaffold
  - run skaffold dev (to start the cluster and listen for updates)
  - navigate browser to (https://ticketing.dev/) and type in browser (thisisunsafe) to skip scurity check.

  DONE!!!


  Architectural NOTES.
    video 325: Handling Publish Failures.