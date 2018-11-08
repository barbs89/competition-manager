Rails.application.routes.draw do
  
  root 'authentication#index'
  
  get 'users/index'

  resources :authentication

  post '/login', to: 'authentication#login'
  get '/logout', to: 'authentication#logout'
end
