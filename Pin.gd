extends StaticBody2D

func _on_area_2d_input_event(viewport: Node, event: InputEvent, shape_idx: int) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		GlobalSignals.pin_pulled.emit("red")
		queue_free()
	elif event is InputEventScreenTouch and event.pressed:
		GlobalSignals.pin_pulled.emit("red")
		queue_free()
