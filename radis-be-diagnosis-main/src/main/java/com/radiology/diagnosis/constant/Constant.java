package com.radiology.diagnosis.constant;

public final class Constant {

    private Constant() {
    }

    public static final String BASE_URL = "/api";
    public static final String SYMPTOM_URL = BASE_URL + "/symptom";
    public static final String DIAGNOSIS_URL = BASE_URL + "/diagnosis";

    public static final String PRIMARY_SYMPTOM_URL = SYMPTOM_URL + "/primary";
    public static final String PRIMARY_SEARCH_SYMPTOM_URL = PRIMARY_SYMPTOM_URL + "/search";
    public static final String SECONDARY_SYMPTOM_URL = SYMPTOM_URL + "/secondary";
    public static final String SECONDARY_SEARCH_SYMPTOM_URL = SECONDARY_SYMPTOM_URL + "/search";
    public static final String IMAGING_COMBINATION_URL = SYMPTOM_URL + "/imaging-combination";
    public static final String IMAGING_TYPE_URL = SYMPTOM_URL + "/imaging-type";


    public static final String PRIMARY_SYMPTOM_NOT_FOUND = "Primary Symptom not found";
    public static final String SECONDARY_SYMPTOM_NOT_FOUND = "Secondary Symptom not found";
    public static final String IMAGING_COMBINATION_NOT_FOUND = "Imaging Combination not found";
    public static final String IMAGING_TYPE_NOT_FOUND = "Imaging Type not found";
}
