def isPresent(n, nums, target):
    st = 0
    end = len(nums) - 1

    while st <= end:
        mid = (st + end) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            end = mid - 1
        else:
            st = mid + 1
    return -1