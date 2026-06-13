def firstOccurrence(nums):
    start = 0
    end = len(nums) - 1
    ans = -1

    while start <= end:
        mid = (start + end) // 2

        if nums[mid] == 1:
            ans = mid
            end = mid - 1
        else:
            start = mid + 1  
    return ans