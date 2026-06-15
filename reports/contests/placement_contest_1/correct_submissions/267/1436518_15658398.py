def trap(arr):
    n = len(arr)
    if n == 0:
        return 0

    water = 0
    i = 0

    while i < n - 1:
        # find next greater or equal bar
        j = i + 1
        max_idx = j

        while j < n and arr[j] < arr[i]:
            if arr[j] >= arr[max_idx]:
                max_idx = j
            j += 1

        # if found proper right boundary
        if j < n:
            right = j
        else:
            # no greater bar → use highest in between
            right = max_idx

        height = min(arr[i], arr[right])

        for k in range(i + 1, right):
            if height > arr[k]:
                water += height - arr[k]

        i = right  # jump directly

    return water