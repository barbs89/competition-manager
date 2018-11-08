require "redis"
require "firebase_id_token"

FirebaseIdToken.configure do |config|
  # set firebase project id
  config.project_ids = ['teamapp-project-debc5']
  # initialize redis and set 
  uri = ENV["REDISTOGO_URL"] || "redis://localhost:6379/0"
  config.redis = Redis.new(url: uri)
end