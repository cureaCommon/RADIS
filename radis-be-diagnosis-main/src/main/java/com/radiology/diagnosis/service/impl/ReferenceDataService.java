package com.radiology.diagnosis.service.impl;

import com.radiology.diagnosis.model.ImagingCombination;
import com.radiology.diagnosis.model.ImagingType;
import com.radiology.diagnosis.model.PrimarySymptom;
import com.radiology.diagnosis.model.SecondarySymptom;
import com.radiology.diagnosis.repository.ImagingCombinationRepository;
import com.radiology.diagnosis.repository.ImagingTypeRepository;
import com.radiology.diagnosis.repository.PrimarySymptomRepository;
import com.radiology.diagnosis.repository.SecondarySymptomRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static com.radiology.diagnosis.util.SpreadsheetUtil.getCellValueAsString;

@Service
public class ReferenceDataService {

    private final ImagingTypeRepository imagingTypeRepository;
    private final PrimarySymptomRepository primarySymptomRepository;
    private final SecondarySymptomRepository secondarySymptomRepository;
    private final ImagingCombinationRepository imagingCombinationRepository;

    public ReferenceDataService(ImagingTypeRepository imagingTypeRepository,
                                PrimarySymptomRepository primarySymptomRepository,
                                SecondarySymptomRepository secondarySymptomRepository,
                                ImagingCombinationRepository imagingCombinationRepository) {
        this.imagingTypeRepository = imagingTypeRepository;
        this.primarySymptomRepository = primarySymptomRepository;
        this.secondarySymptomRepository = secondarySymptomRepository;
        this.imagingCombinationRepository = imagingCombinationRepository;
    }

    public void create(MultipartFile file) throws IOException {

        List<Map<String, String>> result = new ArrayList<>();

        try (InputStream fis = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            Row headerRow = rowIterator.next();
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue());
            }

            while (rowIterator.hasNext()) {
            //int a = 0;
            //while (a < 330) { //11
                //a++;
                Row row = rowIterator.next();
                Map<String, String> rowMap = new LinkedHashMap<>();
                for (int i = 0; i < headers.size(); i++) {
                    Cell cell = row.getCell(i, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    rowMap.put(headers.get(i), getCellValueAsString(cell));
                }
                result.add(rowMap);
            }
        }

        PrimarySymptom lastFoundPrimarySymptom = null;
        SecondarySymptom lastFoundSecondarySymptom = null;

        for (Map<String, String> row : result) {
            String primarySymptom = row.get("Primary").trim();
            String secondarySymptom = row.get("Secondary").trim();
            String sutCode = row.get("SUT").trim();
            String sutName = row.get("SUTMAP").trim();

            if (!primarySymptom.isEmpty() && !secondarySymptom.isEmpty()) {

                if (primarySymptomRepository.findByName(primarySymptom).isEmpty()) {
                    lastFoundPrimarySymptom = primarySymptomRepository.save(new PrimarySymptom(row.get("Primary")));
                }
                if (secondarySymptomRepository.findByName(secondarySymptom).isEmpty()) {
                    lastFoundSecondarySymptom = secondarySymptomRepository
                            .save(new SecondarySymptom(row.get("Secondary"), lastFoundPrimarySymptom));
                }
            }

            if (!sutCode.isEmpty() && !sutName.isEmpty()) {

                if (sutCode.contains(";")) {


                    String[] sutCodes = sutCode.trim().split(";");
                    String[] sutNames = sutName.trim().split(";");

                    Set<ImagingType> imagingTypeSet = new HashSet<>();

                    for (int i = 0; i < sutCodes.length; i++) {

                        String sutCodee = sutCodes[i].trim();
                        String sutNamee = sutNames[i].trim();
                        Optional<ImagingType> itt = imagingTypeRepository.findByCode(sutCodee);
                        if (itt.isEmpty()) {
                            ImagingType it = imagingTypeRepository.save(new ImagingType(sutCodee, sutNamee));
                            imagingTypeSet.add(it);
                        } else {
                            imagingTypeSet.add(itt.get());
                        }

                        ImagingCombination ic = new ImagingCombination();
                        ic.setSecondarySymptom(lastFoundSecondarySymptom);
                        ic.setImagingTypes(imagingTypeSet);
                        ic.setRating(row.get("Rating"));
                        ic.setLiteratureSummary(row.get("Literature summary "));
                        ic.setShortJustification(row.get("Short Justification"));
                        ic.setAdultRRL(row.get("Adult RRL"));
                        imagingCombinationRepository.save(ic);
                    }


                } else {
                    String[] sutCodes = sutCode.trim().split("\\+");
                    String[] sutNames = sutName.trim().split("\\+");

                    Set<ImagingType> imagingTypeSet = new HashSet<>();

                    for (int i = 0; i < sutCodes.length; i++) {

                        String sutCodee = sutCodes[i].trim();
                        String sutNamee = sutNames[i].trim();
                        Optional<ImagingType> itt = imagingTypeRepository.findByCode(sutCodee);
                        if (itt.isEmpty()) {
                            ImagingType it = imagingTypeRepository.save(new ImagingType(sutCodee, sutNamee));
                            imagingTypeSet.add(it);
                        } else {
                            imagingTypeSet.add(itt.get());
                        }
                    }

                    ImagingCombination ic = new ImagingCombination();
                    ic.setSecondarySymptom(lastFoundSecondarySymptom);
                    ic.setImagingTypes(imagingTypeSet);
                    ic.setRating(row.get("Rating"));
                    ic.setLiteratureSummary(row.get("Literature summary "));
                    ic.setShortJustification(row.get("Short Justification"));
                    ic.setAdultRRL(row.get("Adult RRL"));
                    imagingCombinationRepository.save(ic);
                }
            }

            //System.out.println(row);
        }
    }
}
