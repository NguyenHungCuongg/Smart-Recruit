package com.smartrecruit.backend.service;

import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.enums.RoleType;
import com.smartrecruit.backend.repository.JobDescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final JobDescriptionRepository jobDescriptionRepository;

    /*
    * NOTE: 2 hàm ensureCanAccesJob và canAccessJob đề dùng để kiểm tra quyền của người dùng, tuy nhiên
    * Chúng lại khác nhau về cách trả về: 1 cái thì ném lỗi (không cho chạy nữa), 1 cái thì trả về kết quả
    * true/false thôi
    * */

    // Hàm này sẽ ném ra lỗi ngay (các đoạn code sau khi hàm này được gọi sẽ không chạy nữa)
    public void ensureCanAccessJob(User user, UUID jobId) {
        if (user.getRole() == RoleType.ADMIN) {
            return;
        }
        if (user.getRole() == RoleType.RECRUITER) {
            if (!jobDescriptionRepository.existsByIdAndRecruiterId(jobId, user.getId())) {
                throw new AccessDeniedException("You do not have access to this job");
            }
            return;
        }
        throw new AccessDeniedException("Invalid role");
    }

    // Hàm này trả về thông tin true/false khi được gọi. Không làm gián đoạn gì thêm
    public boolean canAccessJob(User user, UUID jobId) {
        if (user.getRole() == RoleType.ADMIN) {
            return true;
        }
        if (user.getRole() == RoleType.RECRUITER) {
            return jobDescriptionRepository.existsByIdAndRecruiterId(jobId, user.getId());
        }
        return false;
    }
}
