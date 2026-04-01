package com.testgen.quality;

import java.util.List;

import org.springframework.stereotype.Component;

import com.testgen.ai.ResponseParser.TestCaseDTO;
import com.testgen.quality.QualityEngine.QualityResult;

@Component
public class BasicRule implements QualityEngine.QualityRule {
    
    @Override
    public boolean evaluate(String code) 
    {
        return code != null && !code.trim().isEmpty();
    }

	@Override
	public QualityResult evaluate(List<TestCaseDTO> cases) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'evaluate'");
	}
}