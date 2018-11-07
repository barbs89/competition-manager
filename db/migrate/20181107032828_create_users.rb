class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users, id: :uuid do |t|
      t.string :uid
      t.string :username
      t.string :email
      t.string :user_image

      t.timestamps
    end
  end
end
