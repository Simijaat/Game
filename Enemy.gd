extends Node2D

var hp: int = 3

func take_damage(amount: int) -> void:
	hp -= amount
	if hp <= 0:
		queue_free()
