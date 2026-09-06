extends ColorRect

const ENEMY_SCENE = preload("res://Enemy.tscn")
var current_enemy: Node2D

func _ready() -> void:
	GlobalSignals.pin_pulled.connect(_on_pin_pulled)
	# Wait one frame for VBoxContainer to calculate the size of this ColorRect
	await get_tree().process_frame
	_spawn_enemy()

func _spawn_enemy() -> void:
	current_enemy = ENEMY_SCENE.instantiate()
	# Position Enemy on the right side of the CombatView
	current_enemy.position = Vector2(size.x * 0.75, size.y * 0.5)
	add_child(current_enemy)

func _on_pin_pulled(color: String) -> void:
	if is_instance_valid(current_enemy) and current_enemy.hp > 0:
		current_enemy.take_damage(1)
		if current_enemy.hp <= 0:
			current_enemy = null
			# Yield to the next frame to allow the previous enemy to clean up safely before spawning a new one
			await get_tree().process_frame
			_spawn_enemy()
