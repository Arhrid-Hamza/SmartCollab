package com.smartcollab.auth.controller;

import com.smartcollab.auth.dto.SkillDto;
import com.smartcollab.auth.model.Skill;
import com.smartcollab.auth.repository.SkillRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    private final SkillRepository skillRepository;

    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public ResponseEntity<List<SkillDto>> getAllSkills() {
        List<SkillDto> skills = skillRepository.findAll().stream()
                .map(s -> new SkillDto(s.getId(), s.getName(), s.getCategory(), s.getDescription()))
                .toList();
        return ResponseEntity.ok(skills);
    }

    @PostMapping
    public ResponseEntity<SkillDto> createSkill(@RequestBody SkillDto dto) {
        Skill skill = new Skill(dto.name(), dto.category(), dto.description());
        Skill saved = skillRepository.save(skill);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new SkillDto(saved.getId(), saved.getName(), saved.getCategory(), saved.getDescription()));
    }
}
