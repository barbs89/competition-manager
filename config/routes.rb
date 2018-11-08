Rails.application.routes.draw do
  
  root 'authentication#index'
  
  get 'authentication/index'
  get 'authentication/new'
  get 'users/index'
end
