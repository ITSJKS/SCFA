def firstOccurrence(nums):
    left = 0
    right = len(nums)-1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == 2:
            left = mid + 1
        else:
            right = mid - 1
    if left == len(nums):
        return (-1)
    else:
        return (left)