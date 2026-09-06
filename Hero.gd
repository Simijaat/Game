extends Node2D

func _ready() -> void:
	GlobalSignals.pin_pulled.connect(_on_pin_pulled)

func _on_pin_pulled(color: String) -> void:
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2(1.5, 1.5), 0.1)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.1)
