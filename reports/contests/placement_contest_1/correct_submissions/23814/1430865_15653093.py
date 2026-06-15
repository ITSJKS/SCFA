def firstOccurrence(nums):
    left = 0
    right = len(nums) - 1

    if nums[0] == 1:
        return 0

    while left <= right:
        mid = (left + right) // 2

        if (nums[mid] == 2):
            left = mid + 1
        
        elif nums[mid - 1] == 2:
            return mid
        
        else:
            right = mid - 1
    

    return -1