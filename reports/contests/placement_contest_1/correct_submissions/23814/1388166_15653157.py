def firstOccurrence(nums):
    n = len(nums)
    # return n
    start = 0
    end = n - 1

    while (start <= end):
        mid = (start + end) // 2
        if nums[mid] == 1 and mid == 0:
            return 0
        elif nums[mid] == 1 and nums[mid-1] == 2:
            return mid
        elif nums[mid] == 1and nums[mid-1] == 1:
            end = mid - 1
        elif nums[mid] == 2:
            start = mid + 1
    return -1