Rails.application.routes.draw do
  
  root 'authentication#index'
  
  get 'authentication/index'
  get 'users/index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
