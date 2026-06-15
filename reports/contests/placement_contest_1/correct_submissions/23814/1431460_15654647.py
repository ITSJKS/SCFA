def firstOccurrence(nums):
    low, high = 0, len(nums) - 1
    ans = -1

    while low <= high:
        mid = (low + high) // 2

        if nums[mid] == 1:
            ans = mid
            high = mid - 1   # search left side
        else:
            low = mid + 1    # search right side

    return ans