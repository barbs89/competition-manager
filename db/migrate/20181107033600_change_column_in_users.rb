class ChangeColumnInUsers < ActiveRecord::Migration[5.2]
  def change
    change_column_null :users, :user_image, true
  end
end
